export let mfield = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
export let sfield = [
	"dept",
	"id",
	"instructor",
	"title",
	"uuid",
	"fullname",
	"shortname",
	"number",
	"name",
	"address",
	"type",
	"furniture",
	"href",
];

import {InsightError, ResultTooLargeError} from "./IInsightFacade";
import {
	helperOrder,
	checkOrder,
	getField,
	findIntersection,
	checkColumn,
	compareString,
	checkGroup,
	mathCal,
	findUnion,
} from "./QueryHelper";
import {processMax, processAvg, processCount, processMin, processSum} from "./QueryApGrHelpter";

export class QueryController {
	public sections: any = [];
	public filteredSections: any = [];
	public groupedSections: any = [];
	public groupKeys: any = [];
	public applyKeys: any = [];
	public applyValue: any = {};

	public processQuery(
		where: any,
		columns: any,
		order: any,
		transformations: any,
		id: string,
		allSections: any
	): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.sections = allSections;
			this.defaultSetting();
			this.filteredSections = this.helperQuery(where);
			let result: any[] = [];
			if (typeof transformations !== "undefined") {
				let group: any = transformations["GROUP"];
				let apply: any = transformations["APPLY"];
				if (!this.checkForGA(group, apply, columns)) {
					reject(new InsightError());
				}
				result = this.helper(columns);
			} else {
				if (!checkColumn(columns)) {
					reject(new InsightError());
				}
				for (let section of this.filteredSections) {
					let neededSection: any = {};
					for (let c of columns) {
						neededSection[c] = section[c];
					}
					result.push(neededSection);
				}
			}
			if (order !== undefined) {
				if (!checkOrder(order, columns, id, this.applyKeys)) {
					reject(new InsightError());
				}
			}
			if (result.length > 5000) {
				reject(new ResultTooLargeError());
			}
			if (order === undefined) {
				resolve(result);
			} else {
				resolve(helperOrder(result, order));
			}
		});
	}

	public checkForGA(group: any, apply: any, columns: any[]): boolean {
		if (!checkGroup(group)) {
			return false;
		}
		this.groupKeys = group;
		if (this.processGroup(group) === []) {
			return false;
		}
		if (this.processApply(apply) === []) {
			return false;
		}
		for (let c of columns) {
			if (!this.applyKeys.includes(c) && !this.groupKeys.includes(c)) {
				return false;
			}
		}
		return true;
	}

	public helper(columns: any): any[] {
		let count: number = 0;
		let result: any[] = [];
		for (let oneGroup of this.groupedSections) {
			let neededGroup: any = {};
			for (let c of columns) {
				if (this.groupKeys.includes(c)) {
					neededGroup[c] = oneGroup[0][c];
				} else {
					neededGroup[c] = this.applyValue[c][count];
				}
			}
			count++;
			result.push(neededGroup);
		}
		return result;
	}

	public defaultSetting() {
		this.filteredSections = [];
		this.groupedSections = [];
		this.groupKeys = [];
		this.applyKeys = [];
		this.applyValue = {};
	}

	public helperQuery(where: any): any {
		if (Object.keys(where).length === 0) {
			return this.sections;
		}
		let comparator = Object.keys(where)[0];
		switch (comparator) {
			case "LT":
			case "GT":
			case "EQ": {
				return this.processNumber(where[comparator], comparator);
			}
			case "IS": {
				return this.processString(where[comparator], comparator);
			}
			case "AND": {
				return this.processAnd(where[comparator], comparator);
			}
			case "OR": {
				return this.processOr(where[comparator], comparator);
			}
			case "NOT": {
				return this.processNot(where[comparator], comparator);
			}
			default: {
				return [];
			}
		}
	}

	public processNumber(query: any, comparator: string): any {
		let key: any = Object.keys(query)[0];
		let value: number = query[key];
		let filtered: any[] = [];
		for (let section of this.sections) {
			if (typeof section[key] === "undefined") {
				return [];
			}
			if (mathCal(comparator, section[key], value)) {
				filtered.push(section);
			}
		}
		return filtered;
	}

	public processString(query: any, comparator: string): any {
		let key: any = Object.keys(query)[0];
		let value: string = query[key];
		let filtered: any[] = [];
		for (let section of this.sections) {
			if (typeof section[key] === "undefined") {
				return [];
			}
			if (compareString(comparator, section[key], value)) {
				filtered.push(section);
			}
		}
		return filtered;
	}

	public processAnd(query: any, comparator: string): any {
		let filtered: any[] = [];
		for (let i of query) {
			filtered.push(this.helperQuery(i));
		}
		if (filtered.length === 1) {
			return filtered[0];
		}
		return findIntersection(filtered);
	}

	public processOr(query: any, comparator: string): any {
		let filtered: any[] = [];
		for (let i of query) {
			filtered.push(this.helperQuery(i));
		}
		if (filtered.length === 1) {
			return filtered[0];
		}
		return findUnion(filtered);
	}

	public processNot(query: any, comparator: string) {
		let filtered: any[] = [];
		let ex: any[];
		if (Object.keys(query)[0] === "NOT") {
			return this.helperQuery(query["NOT"]);
		}
		ex = this.helperQuery(query);

		for (let section of this.sections) {
			if (!ex.includes(section)) {
				filtered.push(section);
			}
		}
		return filtered;
	}

	public processGroup(group: string[]): any {
		let map: any = new Map();

		for (let section of this.filteredSections) {
			let values: any = [];
			for (let key of group) {
				values.push(section[key]);
			}
			let corekey = JSON.stringify(values);
			if (!map.has(corekey)) {
				let arrWithCoreKey: any = [];
				arrWithCoreKey.push(section);
				map.set(corekey, arrWithCoreKey);
			} else {
				let existWithCoreKey: any = map.get(corekey);
				existWithCoreKey.push(section);
				map.set(corekey, existWithCoreKey);
			}
		}

		for (let value of map.values()) {
			this.groupedSections.push(value);
		}
	}

	public processApply(apply: any): any {
		for (let applyKey of apply) {
			let key = Object.keys(applyKey)[0];
			if (this.applyKeys.includes(key)) {
				return [];
			} else {
				this.applyKeys.push(key);
			}
			this.applyValue[key] = this.processApplyToken(applyKey[key]);
			if (this.applyValue[key] === []) {
				return [];
			}
		}
	}

	public processApplyToken(applyObj: any): any {
		let key = Object.keys(applyObj)[0];

		let value = applyObj[key];
		if (typeof value !== "string") {
			return false;
		}
		if (!mfield.includes(getField(value)) && !sfield.includes(getField(value))) {
			return [];
		}
		if (this.groupKeys.includes(value)) {
			return [];
		}

		if (key === "MAX") {
			return processMax(value, this.groupedSections);
		} else if (key === "MIN") {
			return processMin(value, this.groupedSections);
		} else if (key === "AVG") {
			return processAvg(value, this.groupedSections);
		} else if (key === "COUNT") {
			return processCount(value, this.groupedSections);
		} else if (key === "SUM") {
			return processSum(value, this.groupedSections);
		} else {
			return [];
		}
	}
}
