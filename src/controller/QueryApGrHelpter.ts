import Decimal from "decimal.js";

export function processMax(value: any, groupedSections: any): any {
	let result: any[] = [];
	for (let oneGroup of groupedSections) {
		let currMax = 0;
		for (let section of oneGroup) {
			let secValue = section[value];
			if (typeof secValue !== "number") {
				return [];
			}
			if (currMax < secValue) {
				currMax = secValue;
			}
		}
		result.push(currMax);
	}
	return result;
}

export function processMin(value: any, groupedSections: any): any {
	let result: any[] = [];
	for (let oneGroup of groupedSections) {
		let currMin = Number.MAX_VALUE;
		for (let section of oneGroup) {
			let secValue = section[value];
			if (typeof secValue !== "number") {
				return [];
			}
			if (currMin > secValue) {
				currMin = secValue;
			}
		}
		result.push(currMin);
	}
	return result;
}

export function processAvg(value: any, groupedSections: any): any {
	let result: any[] = [];
	for (let oneGroup of groupedSections) {
		let sum = new Decimal(0);
		let numberOfSections = 0;
		for (let section of oneGroup) {
			if (typeof section[value] !== "number") {
				return [];
			}
			let sectionValue = new Decimal(section[value]);
			sum = Decimal.add(sum, sectionValue);
			numberOfSections++;
		}
		let avg = 0;
		if (numberOfSections !== 0) {
			avg = sum.toNumber() / numberOfSections;
		}
		let res = Number(avg.toFixed(2));
		result.push(res);
	}
	return result;
}

export function processCount(value: any, groupedSections: any): any {
	let result: any[] = [];
	for (let oneGroup of groupedSections) {
		let countLists: any[] = [];
		for (let section of oneGroup) {
			if (!countLists.includes(section[value])) {
				countLists.push(section[value]);
			}
		}
		result.push(countLists.length);
	}
	return result;
}

export function processSum(value: any, groupedSections: any): any {
	let result: any[] = [];
	for (let oneGroup of groupedSections) {
		let sum = 0;
		for (let section of oneGroup) {
			if (typeof section[value] !== "number") {
				return [];
			}
			sum += section[value];
		}
		sum = Number(sum.toFixed(2));
		result.push(sum);
	}
	return result;
}
