"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = __importDefault(require("jszip"));
class DataControllerCourse {
    constructor(s) {
        this.superData = s;
    }
    processAddingCourses(id, content, kind) {
        console.log("in process adding courses");
        return new Promise((resolve, reject) => {
            let Promises = [];
            let sections = [];
            let numRows = 0;
            let zipp;
            zipp = new jszip_1.default();
            try {
                zipp.loadAsync(content, { base64: true }).then((loadedZip) => {
                    loadedZip.folder("courses")?.forEach((relativePath, file) => {
                        Promises.push(file.async("string"));
                    });
                    Promise.all(Promises).then((courses) => {
                        if (courses.length === 0) {
                            reject(false);
                        }
                        sections = this.getSections(courses, id);
                        numRows = sections.length;
                        if (sections.length === 0) {
                            reject(false);
                        }
                        else {
                            try {
                                this.superData.saveDataSet(id, sections, numRows, "courses");
                            }
                            catch {
                                reject(false);
                            }
                            resolve(true);
                        }
                    });
                }).catch(() => {
                    reject(false);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    checkJson(jsonString) {
        try {
            let json = JSON.parse(jsonString);
            return json;
        }
        catch (e) {
            return null;
        }
    }
    getSections(courses, id) {
        let sections = [];
        for (let course of courses) {
            if (this.checkJson(course)) {
                let courseParsed = JSON.parse(course);
                let result = courseParsed.result;
                if (result.length === 0) {
                    continue;
                }
                for (let section of result) {
                    if (typeof section !== "undefined") {
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
            }
            else {
                continue;
            }
        }
        return sections;
    }
}
exports.default = DataControllerCourse;
//# sourceMappingURL=DataControllerCourse.js.map