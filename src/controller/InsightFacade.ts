import {
	IInsightFacade,
	InsightDataset,
	InsightDatasetKind,
	InsightError,
	NotFoundError,
} from "./IInsightFacade";
import DataControllerCourse from "./DataControllerCourse";
import {QueryController, mfield, sfield} from "./QueryController";
import {getField, getId, checkWhere, checkId} from "./QueryHelper";
import DataController from "./DataController";
import SuperDataController from "./SuperDataController";
import {clearData} from "./TestUtils";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */

export default class InsightFacade implements IInsightFacade {
	constructor() {
		console.trace("InsightFacadeImpl::init()");
	}

	private addedIds: string[] = [];
	private superDataController = new SuperDataController();
	private queryController = new QueryController();
	private dataController = new DataController(this.superDataController);
	private dataControllerCourse = new DataControllerCourse(this.superDataController);

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		return new Promise<string[]> ((resolve, reject) => {
			if (kind === InsightDatasetKind.Courses || kind === InsightDatasetKind.Rooms) {
				console.log("id: " + id);
				let changedId = id;
				changedId = changedId.replace(/\s/g, "");

				if (id.includes("_")) {
					reject(new InsightError());
				} else if (this.addedIds.includes(id)) {
					console.log("duplicate id gonna reject");
					reject(new InsightError());
				} else if (changedId === ""){
					console.log("after id");
					reject(new InsightError());
				} else if (kind === InsightDatasetKind.Courses) {
					this.dataControllerCourse.processAddingCourses(id, content, kind).then((result) => {
						if (result) {
							this.addedIds.push(id);
							resolve(this.addedIds);
						} else {
							reject(new InsightError());
						}
					}).catch((err) => {
						reject(new InsightError());
					});
				} else {
					this.dataController.processAddingRooms(id, content, kind).then((result) => {
						if (result) {
							this.addedIds.push(id);
							resolve(this.addedIds);
						} else {
							reject(new InsightError());
						}
					}).catch(() => {
						reject(new InsightError());
					});
				}

			} else {
				reject(new InsightError());
			}
		});
	}

	// public removeDataset(id: string): Promise<string> {
	// 	return Promise.reject("Not implemented.");
	// }
	public removeDataset(id: string): Promise<string> {
		// if id is in the dataset, i remove it and return the id i removed
		// if given an id with all empty spaces / has underscore -> reject with InsightError
		return new Promise<string>((resolve, reject) => {
			let changedId = id;
			changedId = changedId.replace(/\s/g, "");
			if (changedId === "") {
				reject(new InsightError());
			}
			if (id.includes("_")) {
				reject(new InsightError());
			}
			if (this.addedIds.includes(id)) {
				let index = this.addedIds.indexOf(id);
				this.addedIds.splice(index, 1);
				this.superDataController.removeDataFromInsightDataSet(id);
				this.superDataController.removeDataFromDataSet(id);
				clearData(id);
				resolve(id);
			} else {
				reject(new NotFoundError());
			}
		});
	}

	public performQuery(query: any): Promise<any[]> {
		return new Promise<any[]>((resolve, reject) => {
			if (!this.checkPrev(query)) {
				reject(new InsightError());
			}
			let options = query["OPTIONS"];
			let columns: any[] = options["COLUMNS"];
			let id = "";
			let transformations: any = query["TRANSFORMATIONS"];
			if (transformations === "undefined") {
				id = getId(columns[0]);
				for (let i of columns) {
					if (id !== getId(i)) {
						reject(new InsightError());
					}
				}
			} else {
				for (let c of columns) {
					if (mfield.includes(getField(c)) || sfield.includes(getField(c))) {
						id = getId(c);
						break;
					}
				}
				if (!checkId(columns, id)) {
					reject(new InsightError());
				}
			}
			if (!this.addedIds.includes(id)) {
				reject(new InsightError());
			}
			let allSections: any = this.superDataController.getDatasets()[id];
			if (allSections === undefined) {
				reject(new InsightError());
			}
			let where: any = query["WHERE"];
			if (!checkWhere(where)) {
				reject(new InsightError());
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

	public checkPrev(query: any): boolean {
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
			let transformations: any = query["TRANSFORMATIONS"];
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

	public listDatasets(): Promise<InsightDataset[]> {
		return new Promise<InsightDataset[]>((resolve, reject) => {
			resolve(this.superDataController.getInsightDatasets());
		});
	}

}
