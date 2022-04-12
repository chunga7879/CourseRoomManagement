"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryController = exports.sfield = exports.mfield = void 0;
exports.mfield = ["avg", "pass", "fail", "audit", "year", "lat", "lon", "seats"];
exports.sfield = [
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
const IInsightFacade_1 = require("./IInsightFacade");
const QueryHelper_1 = require("./QueryHelper");
const QueryApGrHelpter_1 = require("./QueryApGrHelpter");
class QueryController {
    constructor() {
        this.sections = [];
        this.filteredSections = [];
        this.groupedSections = [];
        this.groupKeys = [];
        this.applyKeys = [];
        this.applyValue = {};
    }
    processQuery(where, columns, order, transformations, id, allSections) {
        return new Promise((resolve, reject) => {
            this.sections = allSections;
            this.defaultSetting();
            this.filteredSections = this.helperQuery(where);
            let result = [];
            if (typeof transformations !== "undefined") {
                let group = transformations["GROUP"];
                let apply = transformations["APPLY"];
                if (!this.checkForGA(group, apply, columns)) {
                    reject(new IInsightFacade_1.InsightError());
                }
                result = this.helper(columns);
            }
            else {
                if (!(0, QueryHelper_1.checkColumn)(columns)) {
                    reject(new IInsightFacade_1.InsightError());
                }
                for (let section of this.filteredSections) {
                    let neededSection = {};
                    for (let c of columns) {
                        neededSection[c] = section[c];
                    }
                    result.push(neededSection);
                }
            }
            if (order !== undefined) {
                if (!(0, QueryHelper_1.checkOrder)(order, columns, id, this.applyKeys)) {
                    reject(new IInsightFacade_1.InsightError());
                }
            }
            if (result.length > 5000) {
                reject(new IInsightFacade_1.ResultTooLargeError());
            }
            if (order === undefined) {
                resolve(result);
            }
            else {
                resolve((0, QueryHelper_1.helperOrder)(result, order));
            }
        });
    }
    checkForGA(group, apply, columns) {
        if (!(0, QueryHelper_1.checkGroup)(group)) {
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
    helper(columns) {
        let count = 0;
        let result = [];
        for (let oneGroup of this.groupedSections) {
            let neededGroup = {};
            for (let c of columns) {
                if (this.groupKeys.includes(c)) {
                    neededGroup[c] = oneGroup[0][c];
                }
                else {
                    neededGroup[c] = this.applyValue[c][count];
                }
            }
            count++;
            result.push(neededGroup);
        }
        return result;
    }
    defaultSetting() {
        this.filteredSections = [];
        this.groupedSections = [];
        this.groupKeys = [];
        this.applyKeys = [];
        this.applyValue = {};
    }
    helperQuery(where) {
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
    processNumber(query, comparator) {
        let key = Object.keys(query)[0];
        let value = query[key];
        let filtered = [];
        for (let section of this.sections) {
            if (typeof section[key] === "undefined") {
                return [];
            }
            if ((0, QueryHelper_1.mathCal)(comparator, section[key], value)) {
                filtered.push(section);
            }
        }
        return filtered;
    }
    processString(query, comparator) {
        let key = Object.keys(query)[0];
        let value = query[key];
        let filtered = [];
        for (let section of this.sections) {
            if (typeof section[key] === "undefined") {
                return [];
            }
            if ((0, QueryHelper_1.compareString)(comparator, section[key], value)) {
                filtered.push(section);
            }
        }
        return filtered;
    }
    processAnd(query, comparator) {
        let filtered = [];
        for (let i of query) {
            filtered.push(this.helperQuery(i));
        }
        if (filtered.length === 1) {
            return filtered[0];
        }
        return (0, QueryHelper_1.findIntersection)(filtered);
    }
    processOr(query, comparator) {
        let filtered = [];
        for (let i of query) {
            filtered.push(this.helperQuery(i));
        }
        if (filtered.length === 1) {
            return filtered[0];
        }
        return (0, QueryHelper_1.findUnion)(filtered);
    }
    processNot(query, comparator) {
        let filtered = [];
        let ex;
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
    processGroup(group) {
        let map = new Map();
        for (let section of this.filteredSections) {
            let values = [];
            for (let key of group) {
                values.push(section[key]);
            }
            let corekey = JSON.stringify(values);
            if (!map.has(corekey)) {
                let arrWithCoreKey = [];
                arrWithCoreKey.push(section);
                map.set(corekey, arrWithCoreKey);
            }
            else {
                let existWithCoreKey = map.get(corekey);
                existWithCoreKey.push(section);
                map.set(corekey, existWithCoreKey);
            }
        }
        for (let value of map.values()) {
            this.groupedSections.push(value);
        }
    }
    processApply(apply) {
        for (let applyKey of apply) {
            let key = Object.keys(applyKey)[0];
            if (this.applyKeys.includes(key)) {
                return [];
            }
            else {
                this.applyKeys.push(key);
            }
            this.applyValue[key] = this.processApplyToken(applyKey[key]);
            if (this.applyValue[key] === []) {
                return [];
            }
        }
    }
    processApplyToken(applyObj) {
        let key = Object.keys(applyObj)[0];
        let value = applyObj[key];
        if (typeof value !== "string") {
            return false;
        }
        if (!exports.mfield.includes((0, QueryHelper_1.getField)(value)) && !exports.sfield.includes((0, QueryHelper_1.getField)(value))) {
            return [];
        }
        if (this.groupKeys.includes(value)) {
            return [];
        }
        if (key === "MAX") {
            return (0, QueryApGrHelpter_1.processMax)(value, this.groupedSections);
        }
        else if (key === "MIN") {
            return (0, QueryApGrHelpter_1.processMin)(value, this.groupedSections);
        }
        else if (key === "AVG") {
            return (0, QueryApGrHelpter_1.processAvg)(value, this.groupedSections);
        }
        else if (key === "COUNT") {
            return (0, QueryApGrHelpter_1.processCount)(value, this.groupedSections);
        }
        else if (key === "SUM") {
            return (0, QueryApGrHelpter_1.processSum)(value, this.groupedSections);
        }
        else {
            return [];
        }
    }
}
exports.QueryController = QueryController;
//# sourceMappingURL=QueryController.js.map