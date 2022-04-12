import {InsightDatasetKind} from "./IInsightFacade";
import JSZip from "jszip";
import SuperDataController from "./SuperDataController";
import {roomInfoFunction} from "./RoomHelper";

const parse5 = require("parse5");
const http = require("http");
export default class DataController {
	public count = 1;
	public links: any[] = [];
	public shortname: any;
	public fullname: any;
	public address: any;
	public buildings: any = {};
	public urlGeoCombo: any = {};
	public urls: any[] = [];
	public shortNames: any = [];
	public superData: SuperDataController;
	constructor(s: SuperDataController) {
		this.superData = s;
	}

	public processAddingRooms(id: string, content: string, kind: InsightDatasetKind): Promise<boolean> {
		return new Promise((resolve, reject) => {
			let Promises: Array<Promise<string>> = [];
			let roomsDC: any[] = [];
			let numRows: number = 0;
			let zipp: JSZip;
			zipp = new JSZip();
			try {
				zipp.loadAsync(content, {base64: true}).then((loadedZip) => {
					let count = 0;
					loadedZip.folder("rooms")?.forEach((relativePath: string, file) => {
						if (file.name === "rooms/index.htm") {
							Promises.push(file.async("string"));
							count++;
						}
					});
					if (count === 0) {
						reject(false);
					}
					Promise.all(Promises).then((building: string[]) => {
						if (building.length === 0) {
							reject(false);
						}
						return building;
					}).then((b: string[])=> {
						return this.processAddingBuildings(b, loadedZip, roomsDC, numRows, id);
					}).then((result) => {
						resolve(result);
					}).catch(() => {
						reject(false);
					});
				}).catch(() => {
					reject(false);
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	public processAddingBuildings
	(building: string[], loadedZip: JSZip, roomsDC: any[], numRows: number, id: string): Promise<boolean>{
		return new Promise((resolve, reject) => {
			const doc = parse5.parse(building.toString());
			let buildingNode: any = this.searchTbody(doc);
			this.getBuildings(loadedZip, buildingNode, id).then((roomsResult: any) => {
				roomsDC = roomsResult;
				numRows = roomsDC.length;
				if (roomsDC.length === 0) {
					reject(false);
				} else {
					try {
						this.superData.saveDataSet(id, roomsDC, numRows, "rooms");
					} catch {
						reject(false);
					}
					resolve(true);
				}
			}) ;
		});
	}

	public getGeoLoc(): Promise<any> {
		return new Promise((resolve, reject) => {
			// let pArr = [];
			let parsedData: any;
			let thatNameObj: any = {};
			let Promises: Array<Promise<any[]>> = [];
			for (let url of this.urls) {
				Promises.push(new Promise((resolve2, reject2) => {
					let index = this.urls.indexOf(url).toString();
					let options = {host: "cs310.students.cs.ubc.ca", port: "11316", path: url};
					http.get(options, (res: any) => { // instead of url
						res.setEncoding("utf8");
						let rawData = "";
						res.on("data", (chunk: any) => rawData += chunk);
						res.on("end", () => {
							try {
								parsedData = JSON.parse(rawData);
								let nameGeoArr: any[] = [];
								nameGeoArr[0] = this.urlGeoCombo[index];
								nameGeoArr[1] = parsedData;
								resolve2(nameGeoArr);
							} catch (e) {
								reject2(e);
							}
						});
					}).on("error", (e: any) => {
						reject2(e);
					});
				}));
			}
			Promise.all(Promises).then((parsedDataStuffs) => {
				for (let nameGeoArr of parsedDataStuffs) {
					thatNameObj[nameGeoArr[0]] = nameGeoArr[1];
				}
				resolve(thatNameObj);
			}).catch(function (e) {
				reject(e);
			});
		});
	}

	public processBuilding(node: any) {
		let skip: boolean = false;
		if (node["nodeName"] !== "#text" || node["value"].trim().length === 0) {
			skip = true;
		}
		let keys: any = Object.keys(node);
		for (let key of keys) {
			if (key === "parentNode") {
				continue;
			}
			if (key !== "childNodes") {
				if (!skip && key !== "nodeName") {
					if (this.count % 4 === 1) {
						this.shortname = node[key].trim();
					} else if (this.count % 4 === 2) {
						this.fullname = node[key].trim();
					} else if (this.count % 4 === 3) {
						this.address = node[key].trim();
					} else {
						let building: any = {};
						building["shortname"] = this.shortname;
						building["fullname"] = this.fullname;
						building["address"] = this.address;
						this.buildings[this.shortname] = [this.fullname, this.address]; // boolean data is in index2
					}
					this.count++;
				}
			} else {
				let childNodes: any = node["childNodes"];
				for (let childNode of childNodes) {
					this.processBuilding(childNode);
				}
			}
		}
	}

	public searchTbody(node: any): any {
		if (node["nodeName"] === "tbody") {
			return node;
		}
		if (!("childNodes" in node)) {
			return null;
		}
		let childNodes: any[] = node["childNodes"];
		if (childNodes.length === 0) {
			return null;
		}
		for (let childNode of childNodes) {
			let result = this.searchTbody(childNode);
			if (result !== null) {
				return result;
			}
		}
		return null;
	}

	public checkGeoError(buildingNode: any) {
		this.processBuilding(buildingNode); // processes-> buildings[shortname] = [fullname, address];
		for (let key of Object.keys(this.buildings)) {
			let htmlAddress: string;
			htmlAddress = "/api/v1/project_team148/" // http://cs310.students.cs.ubc.ca:11316
				+ this.buildings[key][1].replace(/ /gi, "%20");
			this.urls.push(htmlAddress);
			this.urlGeoCombo[this.urls.indexOf(htmlAddress)] = key;
		}
	}

	public getLinks(node: any) {
		if (node.attrs) {
			if (node.nodeName === "a") { // value.value =./campus/discover/buildings-and-classrooms/ACU
				node.attrs.forEach((value: any) => {
					if (value.name === "href") {
						if (!this.links.includes(value.value)) {
							this.links.push(value.value);
						}
					}
				});
			}
			if (node.childNodes) {
				for (let child of node.childNodes) {
					this.getLinks(child);
				}
			}
		}
	}

	public getBuildings(zip2: JSZip, buildingNode: any, id: string): Promise<any> {
		return new Promise((resolve, reject) => {
			let rooms: any[] = [];
			let Promises: Array<Promise<string>> = [];
			let roomsInfoFilled: any[] = [];
			this.getLinks(buildingNode); // added building-path-link to links-array
			this.checkGeoError(buildingNode); // buildingNode are the ones appear index.htm
			let file: any;
			for (let link of this.links) { // links of each building
				file = link.substring(link.indexOf("/") + 1);// campus/discover....../shortname
				let path = link.split("/");// ['.', 'discover', 'campus', ...] path = one-building
				zip2.folder("rooms")?.forEach((relativePath: string, file2) => {
					if ("rooms/" + file === file2.name) {
						this.shortNames.push(path[4]);
						Promises.push(file2.async("string")); // push each buildings that have link
					}
				});
			}
			Promise.all(Promises).then((building) => {
				let buildingCount = 0;
				let roomObjWithRoomsInfoFilled: any = [];
				for (let roomsOfABuilding of building) {
					if (roomsOfABuilding.length === 0) {
						continue;
					}
					roomsInfoFilled = this.getRooms(roomsOfABuilding, id); // roomsInfo filled
					for (let roomObj of roomsInfoFilled) {
						let shortN = this.shortNames;
						roomObj[Object.keys(roomObj)[0]] = this.buildings[shortN[buildingCount]][0];
						roomObj[Object.keys(roomObj)[1]] = shortN[buildingCount];
						roomObj[Object.keys(roomObj)[3]] = roomObj[Object.keys(roomObj)[1]]
							+ "_" + roomObj[Object.keys(roomObj)[2]];
						roomObj[Object.keys(roomObj)[4]] = this.buildings[shortN[buildingCount]][1];
						roomObjWithRoomsInfoFilled.push(roomObj);
					}
					buildingCount++;
				}
				this.getGeoLoc().then((result: any) => {
					for (let roomObj of roomObjWithRoomsInfoFilled) {
						this.putInGeoLocInRoom(result, roomObj);
						rooms.push(roomObj);
					}
					resolve(rooms);
				}).catch(function (err) {
					reject(err);
				});
			});
		});
	}

	public putInGeoLocInRoom(nameObj: any, roomObj: any) {
		let shortN = roomObj[Object.keys(roomObj)[1]];
		roomObj[Object.keys(roomObj)[5]] = nameObj[shortN]["lat"];
		roomObj[Object.keys(roomObj)[6]] = nameObj[shortN]["lon"];
	}

	public getRooms(roomsOfABuilding: any, id: string): any {
		let roomsInfo = this.parseRoomsInfo(roomsOfABuilding, id); // get array of room obj
		return roomsInfo;
	}

	public parseRoomsInfo(roomsInBuilding: any, id: string): any[] {
		let roomLinks: any[];
		let roomsInfoNew: any[] = [];
		let firstTag = roomsInBuilding.indexOf("<tbody>");
		let lastTag = roomsInBuilding.indexOf("</tbody>") + 8;
		if (firstTag > 0 && lastTag > 0) {
			let fragment = roomsInBuilding.substring(firstTag, lastTag);
			const document = parse5.parseFragment(fragment);
			roomLinks = document.childNodes[0].childNodes;
			for (let i = 1; i < roomLinks.length; i += 2) {
				let obj = this.parseRoomInfo(roomLinks[i], id);
				roomsInfoNew.push(obj);
			}
		}
		return roomsInfoNew; // returns array of roomObj
	}

	public parseRoomInfo(room: any, id: string): any {
		let roomInfo: any = {};
		let roomData: any[] = room.childNodes;
		let roomCons = roomInfoFunction(roomInfo, roomData, id);
		let roomObj = roomCons.makeObject();
		return roomObj;
	}
}
