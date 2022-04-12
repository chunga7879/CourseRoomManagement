"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
const fs = __importStar(require("fs-extra"));
const pDir = "./data";
class SuperDataController {
    constructor() {
        this.insightDatasets = [];
        this.datasets = {};
    }
    saveDataSet(providedId, data, providedNumRows, type) {
        let myDataset;
        if (type === "courses") {
            myDataset = {
                id: providedId,
                kind: IInsightFacade_1.InsightDatasetKind.Courses,
                numRows: providedNumRows
            };
        }
        else {
            myDataset = {
                id: providedId,
                kind: IInsightFacade_1.InsightDatasetKind.Rooms,
                numRows: providedNumRows
            };
        }
        this.insightDatasets.push(myDataset);
        this.datasets[providedId] = data;
        if (!fs.existsSync(pDir)) {
            fs.mkdirSync(pDir);
        }
        fs.writeFileSync(pDir + "/" + myDataset.id + ".json", JSON.stringify(data));
    }
    getInsightDatasets() {
        return this.insightDatasets;
    }
    getDatasets() {
        return this.datasets;
    }
    removeDataFromInsightDataSet(removedId) {
        for (let i of this.insightDatasets) {
            if (i.id === removedId) {
                let index = this.insightDatasets.indexOf(i);
                this.insightDatasets.splice(index, 1);
            }
        }
    }
    removeDataFromDataSet(removedId) {
        delete this.datasets[removedId];
    }
}
exports.default = SuperDataController;
//# sourceMappingURL=SuperDataController.js.map