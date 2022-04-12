import {mfield, sfield} from "./QueryController";

export function helperOrder(result: any, orderQuery: any) {
	let orderQueryKeys: string[] = [];
	if (typeof orderQuery === "string") {
		orderQueryKeys.push(orderQuery);
		return sortingByAscendingOrder(result, orderQueryKeys);
	} else {
		let dir: string = orderQuery["dir"];
		orderQueryKeys = orderQuery["keys"];
		if (dir === "UP") {
			sortingByAscendingOrder(result, orderQueryKeys);
		} else {
			sortingByDescendingOrder(result, orderQueryKeys);
		}
	}
	return result;
}

function sortingByAscendingOrder(sections: any, orderQueryKeys: string[]) {
	sections.sort((n1: any, n2: any) => {
		if (n1[orderQueryKeys[0]] > n2[orderQueryKeys[0]]) {
			return 1;
		} else if (n1[orderQueryKeys[0]] < n2[orderQueryKeys[0]]) {
			return -1;
		} else {
			return helpTieAscending(n1, n2, orderQueryKeys);
		}
	});
	return sections;
}

function sortingByDescendingOrder(sections: any, orderQueryKeys: string[]) {
	sections.sort((n1: any, n2: any) => {
		if (n1[orderQueryKeys[0]] < n2[orderQueryKeys[0]]) {
			return 1;
		} else if (n1[orderQueryKeys[0]] > n2[orderQueryKeys[0]]) {
			return -1;
		} else {
			return helpTieDescending(n1, n2, orderQueryKeys);
		}
	});
	return sections;
}

function helpTieAscending(s1: any, s2: any, orderQueryKeys: string[]) {
	for (let key of orderQueryKeys) {
		if (s1[key] > s2[key]) {
			return 1;
		} else if (s1[key] < s2[key]) {
			return -1;
		}
	}
	return 0;
}

function helpTieDescending(s1: any, s2: any, orderQueryKeys: string[]) {
	for (let key of orderQueryKeys) {
		if (s1[key] < s2[key]) {
			return 1;
		} else if (s1[key] > s2[key]) {
			return -1;
		}
	}
	return 0;
}

export function checkOrder(order: any, columns: string[], id: string, applyKeys: any): boolean {
	if (typeof order === "string") {
		if (!mfield.includes(getField(order)) && !sfield.includes(getField(order))) {
			return false;
		}

		for (let c of columns) {
			if (c === order) {
				return true;
			}
		}
		return false;
	} else {
		if (Object.keys(order).length !== 2) {
			return false;
		}
		let dir = order["dir"];
		let orderKeys = order["keys"];
		if (typeof dir !== "string" || orderKeys === undefined) {
			return false;
		}
		if (dir !== "UP" && dir !== "DOWN") {
			return false;
		}
		if (orderKeys.length === 0) {
			return false;
		}
		for (let orderKey of orderKeys) {
			if (!columns.includes(orderKey)) {
				return false;
			}
		}
	}
	return true;
}

export function getField(str: string): string {
	return str.split("_")[1];
}

export function getId(str: string): string {
	return str.split("_")[0];
}

export function findIntersection(filtered: any[]): any {
	let inter: any[] = [];
	let prev = filtered[0];
	for (let i of filtered) {
		inter = getCommon(prev, i);
		prev = inter;
	}
	return inter;
}

export function getCommon(prev: any[], f: any[]): any {
	let common: any[] = [];
	for (let i of f) {
		if (prev.includes(i) && !common.includes(i)) {
			common.push(i);
		}
	}
	return common;
}

export function checkWhere(where: any): boolean {
	if (Object.keys(where).length === 0) {
		return true;
	} else if (Object.keys(where).length !== 1) {
		return false;
	} else {
		let comparator: string = Object.keys(where)[0];
		switch (comparator) {
			case "AND":
			case "OR": {
				if (where[comparator].length === 0) {
					return false;
				}
				let els = where[comparator];
				for (let e of els) {
					if (!checkWhere(e)) {
						return false;
					}
				}
				return true;
			}
			case "LT": case "GT": case "EQ": {
				let m = where[comparator];
				let key = Object.keys(m);
				if (key.length !== 1) {
					return false;
				}
				let mkey = key[0];
				let value: any = m[mkey];
				return typeof value === "number" && mfield.includes(getField(mkey));
			}
			case "IS": {
				let s = where[comparator];
				let key = Object.keys(s);
				if (key.length !== 1) {
					return false;
				}
				let skey: string = key[0];
				let value = s[skey];
				return typeof value === "string" && sfield.includes(getField(skey));
			}
			case "NOT": {
				return checkWhere(where[comparator]);
			}
			default: {
				return false;
			}
		}
	}
}

export function checkColumn(columns: any[]): boolean {
	for (let c of columns) {
		let field = getField(c);
		if (!mfield.includes(field) && !sfield.includes(field)) {
			return false;
		}
	}
	return true;
}

export function compareString(comparator: string, sectionKey: any, value: string): boolean {
	let regex: RegExp = new RegExp("^" + value.split("*").join(".*") + "$");
	return sectionKey.match(regex);
}

export function checkGroup(group: any): boolean {
	if (typeof group === "undefined") {
		return false;
	}
	if (group.length === 0) {
		return false;
	}
	for (let g of group) {
		if (typeof g !== "string") {
			return false;
		}
		if (!mfield.includes(getField(g)) && !sfield.includes(getField(g))) {
			return false;
		}
	}
	return true;
}

export function findUnion(filtered: any[]): any {
	let union: any[] = [];
	for (let i of filtered) {
		for (let j of i) {
			if (!union.includes(j)) {
				union.push(j);
			}
		}
	}
	return union;
}

export function mathCal(comparator: string, sectionKey: number, value: number): boolean {
	if (comparator === "GT") {
		return sectionKey > value;
	} else if (comparator === "EQ") {
		return sectionKey === value;
	} else {
		return sectionKey < value;
	}
}

export function checkId(columns: any, id: string): boolean {
	for (let c of columns) {
		if (mfield.includes(getField(c)) || sfield.includes(getField(c))) {
			if (id !== getId(c)) {
				return false;
			}
		}
	}
	return true;
}
