"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
const DataControllerCourse_1 = __importDefault(require("./DataControllerCourse"));
const QueryController_1 = require("./QueryController");
const QueryHelper_1 = require("./QueryHelper");
const DataController_1 = __importDefault(require("./DataController"));
const SuperDataController_1 = __importDefault(require("./SuperDataController"));
const TestUtils_1 = require("./TestUtils");
class InsightFacade {
    constructor() {
        this.addedIds = [];
        this.superDataController = new SuperDataController_1.default();
        this.queryController = new QueryController_1.QueryController();
        this.dataController = new DataController_1.default(this.superDataController);
        this.dataControllerCourse = new DataControllerCourse_1.default(this.superDataController);
        console.trace("InsightFacadeImpl::init()");
    }
    addDataset(id, content, kind) {
        return new Promise((resolve, reject) => {
            if (kind === IInsightFacade_1.InsightDatasetKind.Courses || kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
                console.log("id: " + id);
                let changedId = id;
                changedId = changedId.replace(/\s/g, "");
                if (id.includes("_")) {
                    reject(new IInsightFacade_1.InsightError());
                }
                else if (this.addedIds.includes(id)) {
                    console.log("duplicate id gonna reject");
                    reject(new IInsightFacade_1.InsightError());
                }
                else if (changedId === "") {
                    console.log("after id");
                    reject(new IInsightFacade_1.InsightError());
                }
                else if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                    this.dataControllerCourse.processAddingCourses(id, content, kind).then((result) => {
                        if (result) {
                            this.addedIds.push(id);
                            resolve(this.addedIds);
                        }
                        else {
                            reject(new IInsightFacade_1.InsightError());
                        }
                    }).catch((err) => {
                        reject(new IInsightFacade_1.InsightError());
                    });
                }
                else {
                    this.dataController.processAddingRooms(id, content, kind).then((result) => {
                        if (result) {
                            this.addedIds.push(id);
                            resolve(this.addedIds);
                        }
                        else {
                            reject(new IInsightFacade_1.InsightError());
                        }
                    }).catch(() => {
                        reject(new IInsightFacade_1.InsightError());
                    });
                }
            }
            else {
                reject(new IInsightFacade_1.InsightError());
            }
        });
    }
    removeDataset(id) {
        return new Promise((resolve, reject) => {
            let changedId = id;
            changedId = changedId.replace(/\s/g, "");
            if (changedId === "") {
                reject(new IInsightFacade_1.InsightError());
            }
            if (id.includes("_")) {
                reject(new IInsightFacade_1.InsightError());
            }
            if (this.addedIds.includes(id)) {
                let index = this.addedIds.indexOf(id);
                this.addedIds.splice(index, 1);
                this.superDataController.removeDataFromInsightDataSet(id);
                this.superDataController.removeDataFromDataSet(id);
                (0, TestUtils_1.clearData)(id);
                resolve(id);
            }
            else {
                reject(new IInsightFacade_1.NotFoundError());
            }
        });
    }
    performQuery(query) {
        return new Promise((resolve, reject) => {
            if (!this.checkPrev(query)) {
                reject(new IInsightFacade_1.InsightError());
            }
            let options = query["OPTIONS"];
            let columns = options["COLUMNS"];
            let id = "";
            let transformations = query["TRANSFORMATIONS"];
            if (transformations === "undefined") {
                id = (0, QueryHelper_1.getId)(columns[0]);
                for (let i of columns) {
                    if (id !== (0, QueryHelper_1.getId)(i)) {
                        reject(new IInsightFacade_1.InsightError());
                    }
                }
            }
            else {
                for (let c of columns) {
                    if (QueryController_1.mfield.includes((0, QueryHelper_1.getField)(c)) || QueryController_1.sfield.includes((0, QueryHelper_1.getField)(c))) {
                        id = (0, QueryHelper_1.getId)(c);
                        break;
                    }
                }
                if (!(0, QueryHelper_1.checkId)(columns, id)) {
                    reject(new IInsightFacade_1.InsightError());
                }
            }
            if (!this.addedIds.includes(id)) {
                reject(new IInsightFacade_1.InsightError());
            }
            let allSections = this.superDataController.getDatasets()[id];
            if (allSections === undefined) {
                reject(new IInsightFacade_1.InsightError());
            }
            let where = query["WHERE"];
            if (!(0, QueryHelper_1.checkWhere)(where)) {
                reject(new IInsightFacade_1.InsightError());
            }
            this.queryController
                .processQuery(where, columns, options["ORDER"], transformations, id, allSections)
                .then((result) => {
                resolve(result);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    checkPrev(query) {
        if (query === undefined) {
            return false;
        }
        if (Object.keys(query).length !== 2 && Object.keys(query).length !== 3) {
            return false;
        }
        if (query["OPTIONS"] === undefined || query["WHERE"] === undefined) {
            return false;
        }
        if (Object.keys(query).length === 3 && query["TRANSFORMATIONS"] === undefined) {
            return false;
        }
        if (query["TRANSFORMATIONS"] !== undefined) {
            let transformations = query["TRANSFORMATIONS"];
            if (Object.keys(transformations).length !== 2) {
                return false;
            }
            if (transformations["GROUP"] === undefined || transformations["APPLY"] === undefined) {
                return false;
            }
        }
        let options = query["OPTIONS"];
        if (Object.keys(options).length !== 1 && Object.keys(options).length !== 2) {
            return false;
        }
        if (Object.keys(options).length === 2 && typeof options["ORDER"] === "undefined") {
            return false;
        }
        let columns = options["COLUMNS"];
        if (columns === undefined || columns.length < 1) {
            return false;
        }
        return true;
    }
    listDatasets() {
        return new Promise((resolve, reject) => {
            resolve(this.superDataController.getInsightDatasets());
        });
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map