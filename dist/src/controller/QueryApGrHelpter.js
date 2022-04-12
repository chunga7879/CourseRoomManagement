"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSum = exports.processCount = exports.processAvg = exports.processMin = exports.processMax = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
function processMax(value, groupedSections) {
    let result = [];
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
exports.processMax = processMax;
function processMin(value, groupedSections) {
    let result = [];
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
exports.processMin = processMin;
function processAvg(value, groupedSections) {
    let result = [];
    for (let oneGroup of groupedSections) {
        let sum = new decimal_js_1.default(0);
        let numberOfSections = 0;
        for (let section of oneGroup) {
            if (typeof section[value] !== "number") {
                return [];
            }
            let sectionValue = new decimal_js_1.default(section[value]);
            sum = decimal_js_1.default.add(sum, sectionValue);
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
exports.processAvg = processAvg;
function processCount(value, groupedSections) {
    let result = [];
    for (let oneGroup of groupedSections) {
        let countLists = [];
        for (let section of oneGroup) {
            if (!countLists.includes(section[value])) {
                countLists.push(section[value]);
            }
        }
        result.push(countLists.length);
    }
    return result;
}
exports.processCount = processCount;
function processSum(value, groupedSections) {
    let result = [];
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
exports.processSum = processSum;
//# sourceMappingURL=QueryApGrHelpter.js.map