"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = exports.mathCal = exports.findUnion = exports.checkGroup = exports.compareString = exports.checkColumn = exports.checkWhere = exports.getCommon = exports.findIntersection = exports.getId = exports.getField = exports.checkOrder = exports.helperOrder = void 0;
const QueryController_1 = require("./QueryController");
function helperOrder(result, orderQuery) {
    let orderQueryKeys = [];
    if (typeof orderQuery === "string") {
        orderQueryKeys.push(orderQuery);
        return sortingByAscendingOrder(result, orderQueryKeys);
    }
    else {
        let dir = orderQuery["dir"];
        orderQueryKeys = orderQuery["keys"];
        if (dir === "UP") {
            sortingByAscendingOrder(result, orderQueryKeys);
        }
        else {
            sortingByDescendingOrder(result, orderQueryKeys);
        }
    }
    return result;
}
exports.helperOrder = helperOrder;
function sortingByAscendingOrder(sections, orderQueryKeys) {
    sections.sort((n1, n2) => {
        if (n1[orderQueryKeys[0]] > n2[orderQueryKeys[0]]) {
            return 1;
        }
        else if (n1[orderQueryKeys[0]] < n2[orderQueryKeys[0]]) {
            return -1;
        }
        else {
            return helpTieAscending(n1, n2, orderQueryKeys);
        }
    });
    return sections;
}
function sortingByDescendingOrder(sections, orderQueryKeys) {
    sections.sort((n1, n2) => {
        if (n1[orderQueryKeys[0]] < n2[orderQueryKeys[0]]) {
            return 1;
        }
        else if (n1[orderQueryKeys[0]] > n2[orderQueryKeys[0]]) {
            return -1;
        }
        else {
            return helpTieDescending(n1, n2, orderQueryKeys);
        }
    });
    return sections;
}
function helpTieAscending(s1, s2, orderQueryKeys) {
    for (let key of orderQueryKeys) {
        if (s1[key] > s2[key]) {
            return 1;
        }
        else if (s1[key] < s2[key]) {
            return -1;
        }
    }
    return 0;
}
function helpTieDescending(s1, s2, orderQueryKeys) {
    for (let key of orderQueryKeys) {
        if (s1[key] < s2[key]) {
            return 1;
        }
        else if (s1[key] > s2[key]) {
            return -1;
        }
    }
    return 0;
}
function checkOrder(order, columns, id, applyKeys) {
    if (typeof order === "string") {
        if (!QueryController_1.mfield.includes(getField(order)) && !QueryController_1.sfield.includes(getField(order))) {
            return false;
        }
        for (let c of columns) {
            if (c === order) {
                return true;
            }
        }
        return false;
    }
    else {
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
exports.checkOrder = checkOrder;
function getField(str) {
    return str.split("_")[1];
}
exports.getField = getField;
function getId(str) {
    return str.split("_")[0];
}
exports.getId = getId;
function findIntersection(filtered) {
    let inter = [];
    let prev = filtered[0];
    for (let i of filtered) {
        inter = getCommon(prev, i);
        prev = inter;
    }
    return inter;
}
exports.findIntersection = findIntersection;
function getCommon(prev, f) {
    let common = [];
    for (let i of f) {
        if (prev.includes(i) && !common.includes(i)) {
            common.push(i);
        }
    }
    return common;
}
exports.getCommon = getCommon;
function checkWhere(where) {
    if (Object.keys(where).length === 0) {
        return true;
    }
    else if (Object.keys(where).length !== 1) {
        return false;
    }
    else {
        let comparator = Object.keys(where)[0];
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
            case "LT":
            case "GT":
            case "EQ": {
                let m = where[comparator];
                let key = Object.keys(m);
                if (key.length !== 1) {
                    return false;
                }
                let mkey = key[0];
                let value = m[mkey];
                return typeof value === "number" && QueryController_1.mfield.includes(getField(mkey));
            }
            case "IS": {
                let s = where[comparator];
                let key = Object.keys(s);
                if (key.length !== 1) {
                    return false;
                }
                let skey = key[0];
                let value = s[skey];
                return typeof value === "string" && QueryController_1.sfield.includes(getField(skey));
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
exports.checkWhere = checkWhere;
function checkColumn(columns) {
    for (let c of columns) {
        let field = getField(c);
        if (!QueryController_1.mfield.includes(field) && !QueryController_1.sfield.includes(field)) {
            return false;
        }
    }
    return true;
}
exports.checkColumn = checkColumn;
function compareString(comparator, sectionKey, value) {
    let regex = new RegExp("^" + value.split("*").join(".*") + "$");
    return sectionKey.match(regex);
}
exports.compareString = compareString;
function checkGroup(group) {
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
        if (!QueryController_1.mfield.includes(getField(g)) && !QueryController_1.sfield.includes(getField(g))) {
            return false;
        }
    }
    return true;
}
exports.checkGroup = checkGroup;
function findUnion(filtered) {
    let union = [];
    for (let i of filtered) {
        for (let j of i) {
            if (!union.includes(j)) {
                union.push(j);
            }
        }
    }
    return union;
}
exports.findUnion = findUnion;
function mathCal(comparator, sectionKey, value) {
    if (comparator === "GT") {
        return sectionKey > value;
    }
    else if (comparator === "EQ") {
        return sectionKey === value;
    }
    else {
        return sectionKey < value;
    }
}
exports.mathCal = mathCal;
function checkId(columns, id) {
    for (let c of columns) {
        if (QueryController_1.mfield.includes(getField(c)) || QueryController_1.sfield.includes(getField(c))) {
            if (id !== getId(c)) {
                return false;
            }
        }
    }
    return true;
}
exports.checkId = checkId;
//# sourceMappingURL=QueryHelper.js.map