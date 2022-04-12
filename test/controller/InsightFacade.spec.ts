// import chai, {expect} from "chai";
// import chaiAsPromised from "chai-as-promised";
// import {
// 	InsightDatasetKind,
// 	InsightError,
// 	ResultTooLargeError,
// 	NotFoundError
// } from "../../src/controller/IInsightFacade";
// import InsightFacade from "../../src/controller/InsightFacade";
// import {getFileContent, clearDatasets} from "../resources/TestUtils";
// import {testFolder} from "@ubccpsc310/folder-test";
//
// chai.use(chaiAsPromised);
// type Input = any;
// type Output = Promise<any[]>;
// type Error = "InsightError" | "ResultTooLargeError";
//
// describe("InsightFacade", function () {
	// let contents: string;
	// let content2: string;
	// let content4: string;
	// let contents6: string;
	// let insightFacade: InsightFacade;
	// let folderNameNotRooms: string;
	// let notZipFile: string;
	// let someBuildingsNotHTML: string;
	// let oneBuildingNotHTML: string;
	// let missing: string;
	// let noINDEX: string;
	// let noRoom: string;
	// let fiveRooms: string;
	// let severalMissing: string;
	// let indexCopy: string;
	// let twoTableTag: string;
	// let alrdNotInINDEX: string;
	// let noData: string;
	// let noHTML: string;
	//
	// before(function () {
	// 	contents = getFileContent("courses.zip");
		// content2 = getFileContent("courses2.zip");
		// content4 = getFileContent("courses4.zip");
		// contents6 = getFileContent("rooms.zip");
		// folderNameNotRooms = getFileContent("foldernamenotrooms.zip");
		// notZipFile = getFileContent("notZipFile.htm");
		// someBuildingsNotHTML = getFileContent("rooms 6.zip");
		// oneBuildingNotHTML = getFileContent("rooms 7.zip");
		// missing = getFileContent("rooms 2.zip");
		// noINDEX = getFileContent("rooms 3.zip");
		// noRoom = getFileContent("rooms 4.zip");
		// fiveRooms = getFileContent("rooms 5.zip");
		// severalMissing = getFileContent("rooms 8.zip");
		// indexCopy = getFileContent("rooms 9.zip");
		// twoTableTag = getFileContent("rooms 10.zip");
		// alrdNotInINDEX = getFileContent("rooms 11.zip");
		// noData = getFileContent("rooms 12.zip");
		// noHTML = getFileContent("rooms 13.zip");
	// });
	// describe("Add Datasets - Rooms", function () {
	// 	beforeEach(function () {
	// 		clearDatasets();
	// 		insightFacade = new InsightFacade();
	// 	});
	// 	// checking validity of ROOMS dataset:
	// 	it("PERFECTLY VALID: has to be a valid zip file- have folder rooms/", function () {
	// 		this.timeout(200000);
	// 		return insightFacade.addDataset("ubcRooms", contents6, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				expect(addedIds).to.be.instanceof(Array);
	// 				expect(addedIds).to.have.length(1);
	// 			});
	// 		this.done();
	// 	});
	// 	it("not a valid zip file- no folder rooms/", function () {
	// 		this.timeout(200000);
	// 		const result = insightFacade.addDataset("rooms", folderNameNotRooms, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 		this.done();
	// 	});
	// 	it("not a zip at all", function () {
	// 		const result = insightFacade.addDataset("rooms", notZipFile, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	// 	it("some INVALID buildings: some buildings not be in HTML format - dataset inserted w/o them", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", someBuildingsNotHTML, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 6
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	it("A building not in HTML format", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", oneBuildingNotHTML, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 2
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	it("Missing (i.e. empty string) values found in valid HTML elements " +
	// 		"-> should be okay: ex. room_type = ''", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", missing, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				expect(addedIds).to.be.instanceof(Array);
	// 				expect(addedIds).to.have.length(1);
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 5 // actually this is 5, but gotta fix the undefined furniture
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	it("several missing (i.e. empty string) values found in valid HTML elements " +
	// 		"-> should be okay: ex. room_type = ''", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", severalMissing, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				expect(addedIds).to.be.instanceof(Array);
	// 				expect(addedIds).to.have.length(1);
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 5 // actually this is 5, but gotta fix the undefined furniture
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	it("One building in dataset and it contains no rooms at all, so it is ignored " +
	// 		"-> no valid buildings -> rejected", function () {
	// 		this.timeout(20000);
	// 		const result = insightFacade.addDataset("rooms", noRoom, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 		this.done();
	// 	});
	// 	it("a building contains no rooms at all, so it is ignored " +
	// 		"(you don't need to keep building-level information)", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", fiveRooms, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 5
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	// it("valid zip: single index.htm in the root of the rooms/ ");
	// 	it("invalid zip: no index.htm in the root of the rooms/", function () {
	// 		const result = insightFacade.addDataset("rooms", noINDEX, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 		this.done();
	// 	});
	// 	it("valid zip: single index.htm, " +
	// 		"and index2.htm (name is diff) in the root of the rooms/", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", indexCopy, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 5
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	//
	// 	it("invalid zip: 2 index.htm in the root of the rooms/");
	// 	// it("valid zip: All td/> of target data will have attributes " +
	// 	// 	"present in the same forms as in the provided zip file: a td/> " +
	// 	// 	"with the class 'room-data' surrounding target fields will always be present " +
	// 	// 	"in a valid dataset if it is present in the original dataset.");
	// 	it("invalid zip: All td/> in the given file is not there");
	// 	it("VALID: multiple table tags within index.htm that " +
	// 		"have building/classroom links/information", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", twoTableTag, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 5
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	it("You should only parse buildings that are linked to from the index.htm file. " +
	// 		"There may be more building files in the zip, but they should be ignored.", function () {
	// 		this.timeout(20000);
	// 		return insightFacade.addDataset("ubcRooms", alrdNotInINDEX, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				return insightFacade.listDatasets()
	// 					.then((insightDatasets) => {
	// 						expect(insightDatasets).to.deep.equal([{
	// 							id: "ubcRooms",
	// 							kind: InsightDatasetKind.Rooms,
	// 							numRows: 2
	// 						}]);
	// 					});
	// 			});
	// 		this.done();
	// 	});
	// 	// it("VALID: just one 'table' tag within index.htm that have building/classroom links/information");
	//
	// 	it("should add valid multiple datasets", function () {
	// 		this.timeout(200000);
	// 		return insightFacade.addDataset("rooms", fiveRooms, InsightDatasetKind.Rooms)
	// 			.then(() => {
	// 				return insightFacade.addDataset("rooms2", fiveRooms, InsightDatasetKind.Rooms);
	// 			})
	// 			.then((addedIds) => {
	// 				expect(addedIds).to.be.instanceof(Array);
	// 				expect(addedIds).to.have.length(2);
	// 			});
	// 		this.done();
	// 	});
	// 	it("should add multiple datasets with same id: invalid dataset", function () {
	// 		return insightFacade.addDataset("courses1", fiveRooms, InsightDatasetKind.Rooms)
	// 			.then((addedIds) => {
	// 				expect(addedIds).to.be.instanceof(Array);
	// 				expect(addedIds).to.have.length(1);
	// 				const result = insightFacade.addDataset("courses1", fiveRooms, InsightDatasetKind.Rooms);
	// 				return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 			});
	// 	});
	// 	it("should reject invalid dataset: no data", function () {
	// 		const result = insightFacade.addDataset("courses", noData, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	// 	// - invalid dataset -> all courses not in json format, all files invalid and skipped over,
	// 	//                      no at least one valid course section, invalid dataset
	// 	it("should reject invalid dataset: no json file", function () {
	// 		const result = insightFacade.addDataset("courses", noHTML, InsightDatasetKind.Courses);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	// 	// it("should add invalid(room) kind" , function() {
	// 	// 	const result = facade.addDataset("rooms", fiveRooms, "cookies");
	// 	// 	return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	// });
	// 	it("should add invalid id: contain underscore", function () {
	// 		const result = insightFacade.addDataset("course_A", fiveRooms, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	// 	it("should add invalid id: contain only whitespace", function () {
	// 		const result = insightFacade.addDataset("    ", fiveRooms, InsightDatasetKind.Rooms);
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	// });
	// describe("removeDataset", function() {
	// 	beforeEach(function() {
	// 		clearDatasets();
	// 		insightFacade = new InsightFacade();
	// 	});
	//
	// 	it("Should be able to remove a dataset when there is only one data set", function() {
	// 		return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses)
	// 			.then(() => {
	// 				return insightFacade.removeDataset("ubc");
	// 			})
	// 			.then((result) => {
	// 				expect(result).to.be.deep.equal("ubc");
	// 			});
	// 	});
	//
	// 	it("Should be able to remove a dataset when there are some data sets", function() {
	// 		return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses)
	// 			.then(() => {
	// 				return insightFacade.addDataset("bc", contents, InsightDatasetKind.Courses);
	// 			})
	// 			.then(() => {
	// 				return insightFacade.removeDataset("ubc");
	// 			}).then((result) => {
	// 				expect(result).to.be.deep.equal("ubc");
	// 			});
	// 	});
	//
	// 	it("Should not be able to remove a dataset with not added id", function() {
	// 		const result = insightFacade.removeDataset("ubc");
	// 		return expect(result).eventually.to.be.rejectedWith(NotFoundError);
	// 	});
	//
	// 	it("Should not be able to remove a dataset with invalid id - underscore", function() {
	//
	// 		const result = insightFacade.removeDataset("_bc");
	//
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	//
	// 	it("Should not be able to remove a dataset with invalid id - only whitespace characters", function() {
	//
	// 		const result = insightFacade.removeDataset("  ");
	//
	// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
	// 	});
	// });
	//
	// describe("performQuery", function () {
		// describe("performQuery-no before function", function () {
		// 	it("Should not be able to reference a dataset not added", function () {
		// 		clearDatasets();
		// 		insightFacade = new InsightFacade();
		// 		let query = {
		// 			WHERE: {
		// 				GT: {
		// 					courses_avg: 97
		// 				}
		// 			},
		// 			OPTIONS: {
		// 				COLUMNS: [
		// 					"courses_dept",
		// 					"courses_avg"
		// 				],
		// 				ORDER: "courses_avg"
		// 			}
		// 		};
		// 		const result = insightFacade.performQuery(query);
		// 		return expect(result).eventually.to.be.rejectedWith(InsightError);
		// 	});
		// 	it("Should not be able to reference multiple datasets", function () {
		// 		clearDatasets();
		// 		insightFacade = new InsightFacade();
		// 		let query = {
		// 			WHERE: {
		// 				GT: {
		// 					courses_avg: 97
		// 				}
		// 			},
		// 			OPTIONS: {
		// 				COLUMNS: [
		// 					"courses_dept",
		// 					"courses_avg",
		// 					"bc-courses_avg"
		// 				],
		// 				ORDER: "courses_avg"
		// 			}
		// 		};
		// 		return insightFacade.addDataset("bc-courses", contents, InsightDatasetKind.Courses)
		// 			.then(() => {
		// 				return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses);
		// 			})
		// 			.then(function () {
		// 				const result = insightFacade.performQuery(query);
		// 				return expect(result).to.be.eventually.rejectedWith(InsightError);
		// 			});
		// 	});
		// 	it("Should not be able to reference multiple datasets - case2", function () {
		// 		clearDatasets();
		// 		insightFacade = new InsightFacade();
		// 		let query = {
		// 			WHERE: {
		// 				AND: [
		// 					{
		// 						GT: {
		// 							courses_avg: 90
		// 						}
		// 					},
		// 					{
		// 						IS: {
		// 							courses_dept: "adhe"
		// 						}
		// 					}
		// 				]
		// 			},
		// 			OPTIONS: {
		// 				COLUMNS: [
		// 					"courses_dept",
		// 					"courses_avg",
		// 					"bc-courses_avg"
		// 				],
		// 				ORDER: "courses_avg"
		// 			}
		// 		};
		// 		return insightFacade.addDataset("bc-courses", contents, InsightDatasetKind.Courses)
		// 			.then(() => {
		// 				return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses);
		// 			})
		// 			.then(function () {
		// 				const result = insightFacade.performQuery(query);
		// 				return expect(result).to.be.eventually.rejectedWith(InsightError);
		// 			});
		// 	});
		// });
// 		describe("performQuery-test-folder", function () {
// 			before(async function () {
// 				clearDatasets();
// 				insightFacade = new InsightFacade();
// 				await insightFacade.addDataset("courses", contents, InsightDatasetKind.Courses);
// 			});
// 			testFolder<Input, Output, Error>(
// 				"Query Dynamic",
// 				(input: Input): Output => {
// 					return insightFacade.performQuery(input);
// 				},
// 				"./test/resources/queries",
// 				{
// 					assertOnResult: (expected, actual) => {
// 						expect(actual).to.deep.equal(expected);
// 					},
// 					errorValidator: (error): error is Error =>
// 						error === "InsightError" || error === "ResultTooLargeError",
// 					assertOnError: (expected, actual) => {
// 						if (expected === "InsightError") {
// 							expect(actual).to.be.instanceOf(InsightError);
// 						} else if (expected === "ResultTooLargeError") {
// 							expect(actual).to.be.instanceOf(ResultTooLargeError);
// 						} else {
// 							expect.fail("unexpected error");
// 						}
// 					},
// 				}
// 			);
// 		});
// 		describe("performQuery-test-folder2", function () {
// 			before(async function () {
// 				clearDatasets();
// 				insightFacade = new InsightFacade();
// 				await insightFacade.addDataset("courses", contents, InsightDatasetKind.Courses);
// 			});
// 			testFolder<Input, Output, Error>(
// 				"Query Dynamic",
// 				(input: Input): Output => {
// 					return insightFacade.performQuery(input);
// 				},
// 				"./test/resources/queries2",
// 				{
// 					assertOnResult: (expected, actual) => {
// 						expect(actual).to.deep.equal(expected);
// 					},
// 					errorValidator: (error): error is Error =>
// 						error === "InsightError" || error === "ResultTooLargeError",
// 					assertOnError: (expected, actual) => {
// 						if (expected === "InsightError") {
// 							expect(actual).to.be.instanceOf(InsightError);
// 						} else if (expected === "ResultTooLargeError") {
// 							expect(actual).to.be.instanceOf(ResultTooLargeError);
// 						} else {
// 							expect.fail("unexpected error");
// 						}
// 					},
// 				}
// 			);
// 		});
// 		describe("test-folder 3", function () {
// 			before(async function () {
// 				clearDatasets();
// 				insightFacade = new InsightFacade();
// 				await insightFacade.addDataset("rooms", contents6, InsightDatasetKind.Rooms);
// 			});
// 			it("test3", function () {
// 				testFolder<Input, Output, Error>(
// 					"Query Dynamic",
// 					(input: Input): Output => {
// 						return insightFacade.performQuery(input);
// 					},
// 					"./test/resources/queries3",
// 					{
// 						assertOnResult: (expected, actual) => {
// 							expect(actual).to.deep.equal(expected);
// 						},
// 						errorValidator: (error): error is Error =>
// 							error === "InsightError" || error === "ResultTooLargeError",
// 						assertOnError: (expected, actual) => {
// 							if (expected === "InsightError") {
// 								expect(actual).to.be.instanceOf(InsightError);
// 							} else if (expected === "ResultTooLargeError") {
// 								expect(actual).to.be.instanceOf(ResultTooLargeError);
// 							} else {
// 								expect.fail("unexpected error");
// 							}
// 						},
// 					});
// 			});
// 		});
// 	});
//
// 	describe("listDatasets", function() {
// 		beforeEach(function() {
// 			clearDatasets();
// 			insightFacade = new InsightFacade();
// 		});
// 		it("Should be present when adding no data set", function() {
// 			return insightFacade.listDatasets().then((result) => {
// 				expect(result).to.be.an.instanceof(Array);
// 				expect(result).to.have.length(0);
// 			});
// 		});
// 		it("Should be present when adding one data set - courses", function() {
// 			return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses)
// 				.then(() => {
// 					return insightFacade.listDatasets();
// 				}).then((result) => {
// 					expect(result).to.be.deep.equal([{
// 						id: "ubc",
// 						kind: InsightDatasetKind.Courses,
// 						numRows: 64612
// 					}]);
// 				});
// 		});
// 		it("Should be present when adding one data set - rooms", function() {
// 			this.timeout(200000);
// 			return insightFacade.addDataset("ubcR", contents6, InsightDatasetKind.Rooms)
// 				.then(() => {
// 					return insightFacade.listDatasets();
// 				})
// 				.then((result) => {
// 					expect(result).to.be.deep.equal([{
// 						id: "ubcR",
// 						kind: InsightDatasetKind.Rooms,
// 						numRows: 364
// 					}]);
// 				});
// 			this.done();
// 		});
// 		it("Should not be present when adding one data set - id is space", function() {
// 			this.timeout(200000);
// 			const result = insightFacade.addDataset("   ", contents6, InsightDatasetKind.Rooms);
// 			return expect(result).eventually.to.be.rejectedWith(InsightError)
// 				.then(() => {
// 					return insightFacade.listDatasets();
// 				})
// 				.then((resultList) => {
// 					expect(resultList).to.be.an.instanceof(Array);
// 					expect(resultList).to.have.length(0);
// 				});
// 			this.done();
// 		});
// 		it("Should be present when adding more data set", function() {
// 			this.timeout(2000000);
// 			return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses)
// 				.then(() => {
// 					return insightFacade.addDataset("bcc", contents, InsightDatasetKind.Courses);
// 				})
// 				.then(() => {
// 					return insightFacade.listDatasets();
// 				})
// 				.then((result) => {
// 					expect(result).to.be.an.instanceof(Array);
// 					expect(result).to.have.length(2);
// 				});
// 			this.done();
// 		});
// 		it("Should be present when adding more data set - same ones", function() {
// 			this.timeout(2000000);
// 			return insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses)
// 				.then(() => {
// 					const result =  insightFacade.addDataset("ubc", contents, InsightDatasetKind.Courses);
// 					return expect(result).eventually.to.be.rejectedWith(InsightError);
// 				})
// 				.then(() => {
// 					return insightFacade.listDatasets();
// 				})
// 				.then((resultList) => {
// 					expect(resultList).to.be.an.instanceof(Array);
// 					expect(resultList).to.be.deep.equal([{
// 						id: "ubc",
// 						kind: InsightDatasetKind.Courses,
// 						numRows: 64612
// 					}]);
// 					expect(resultList).to.have.length(1);
// 				});
// 			this.done();
// 		});
// 	});
// });
