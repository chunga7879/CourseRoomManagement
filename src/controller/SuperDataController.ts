import {InsightDataset, InsightDatasetKind} from "./IInsightFacade";
import * as fs from "fs-extra";
const pDir = "./data";

export interface Datasets {
	[id: string]: [];
}

export default class SuperDataController {

	public insightDatasets: InsightDataset[] = [];
	public datasets: Datasets = {};

	public saveDataSet (providedId: string, data: any, providedNumRows: number, type: string) {
		let myDataset: InsightDataset;
		if (type === "courses") {
			myDataset = {
				id: providedId,
				kind: InsightDatasetKind.Courses,
				numRows: providedNumRows
			};
		} else {
			myDataset = {
				id: providedId,
				kind: InsightDatasetKind.Rooms,
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

	public getInsightDatasets(): InsightDataset[] {
		return this.insightDatasets;
	}

	public getDatasets(): Datasets {
		return this.datasets;
	}

	public removeDataFromInsightDataSet(removedId: string): void {
		for (let i of this.insightDatasets) {
			if (i.id === removedId) {
				let index = this.insightDatasets.indexOf(i);
				this.insightDatasets.splice(index, 1);
			}
		}
	}

	public removeDataFromDataSet(removedId: string): void {
		delete this.datasets[removedId];
	}
}
