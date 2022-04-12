import {InsightDatasetKind} from "./IInsightFacade";
import JSZip from "jszip";
import SuperDataController from "./SuperDataController";


export default class DataControllerCourse{

	public superData: SuperDataController;

	constructor(s: SuperDataController) {
		this.superData = s;
	}

	public processAddingCourses(id: string, content: string, kind: InsightDatasetKind): Promise<boolean> {
		console.log("in process adding courses");
		return new Promise ((resolve, reject) => {
			let Promises: Array<Promise<string>> = [];
			let sections: any[] = [];
			let numRows: number = 0;
			let zipp: JSZip;
			zipp = new JSZip();
			try {
				zipp.loadAsync(content, {base64: true}).then((loadedZip) => {
					loadedZip.folder("courses")?.forEach((relativePath: string, file ) => {
						Promises.push(file.async("string"));
					});
					Promise.all(Promises).then((courses) => {
						if(courses.length === 0) {
							reject(false);
						}
						sections = this.getSections(courses, id);
						numRows = sections.length;
						if (sections.length === 0) {
							reject(false);
						} else {
							try {
								this.superData.saveDataSet(id, sections, numRows, "courses");
							} catch {
								reject(false);
							}
							resolve(true);
						}
					});
				}).catch (() => {
					reject(false);
				});

			} catch (e) {
				reject(e);
			}
		});
	}

	public checkJson(jsonString: string) {
		try {
			let json = JSON.parse(jsonString);
			return json;
		} catch (e) {
			return null;
		}
	}

	public getSections(courses: any, id: string): any[] {
		let sections: any[] = [];
		for (let course of courses) {
			if (this.checkJson(course)) {
				let courseParsed = JSON.parse(course);
				let result: any = courseParsed.result;
				if (result.length === 0) {
					continue;
				}
				for (let section of result) {
					if ( typeof section !== "undefined") {
						let year = 1900;
						if (section.Section !== "overall") {
							year = section.Year;
						}
						let keyd = id + "_dept";
						let keyid = id + "_id";
						let keyavg = id + "_avg";
						let keyins = id + "_instructor";
						let keytitle = id + "_title";
						let keypass = id + "_pass";
						let keyfail = id + "_fail";
						let keyaudit = id + "_audit";
						let keyuuid = id + "_uuid";
						let keyyear = id + "_year";
						let sectionObject = {
							[keyd]: section.Subject,
							[keyid]: section.Course,
							[keyavg]: section.Avg,
							[keyins]: section.Professor,
							[keytitle]: section.Title,
							[keypass]: section.Pass,
							[keyfail]: section.Fail,
							[keyaudit]: section.Audit,
							[keyuuid]: section.id.toString(),
							[keyyear]: year
						};
						sections.push(sectionObject);
					}
				}
			} else {
				continue;
			}
		}
		return sections;
	}
}
