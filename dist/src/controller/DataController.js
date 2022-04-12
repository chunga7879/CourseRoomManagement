"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = __importDefault(require("jszip"));
const RoomHelper_1 = require("./RoomHelper");
const parse5 = require("parse5");
const http = require("http");
class DataController {
    constructor(s) {
        this.count = 1;
        this.links = [];
        this.buildings = {};
        this.urlGeoCombo = {};
        this.urls = [];
        this.shortNames = [];
        this.superData = s;
    }
    processAddingRooms(id, content, kind) {
        return new Promise((resolve, reject) => {
            let Promises = [];
            let roomsDC = [];
            let numRows = 0;
            let zipp;
            zipp = new jszip_1.default();
            try {
                zipp.loadAsync(content, { base64: true }).then((loadedZip) => {
                    let count = 0;
                    loadedZip.folder("rooms")?.forEach((relativePath, file) => {
                        if (file.name === "rooms/index.htm") {
                            Promises.push(file.async("string"));
                            count++;
                        }
                    });
                    if (count === 0) {
                        reject(false);
                    }
                    Promise.all(Promises).then((building) => {
                        if (building.length === 0) {
                            reject(false);
                        }
                        return building;
                    }).then((b) => {
                        return this.processAddingBuildings(b, loadedZip, roomsDC, numRows, id);
                    }).then((result) => {
                        resolve(result);
                    }).catch(() => {
                        reject(false);
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
    processAddingBuildings(building, loadedZip, roomsDC, numRows, id) {
        return new Promise((resolve, reject) => {
            const doc = parse5.parse(building.toString());
            let buildingNode = this.searchTbody(doc);
            this.getBuildings(loadedZip, buildingNode, id).then((roomsResult) => {
                roomsDC = roomsResult;
                numRows = roomsDC.length;
                if (roomsDC.length === 0) {
                    reject(false);
                }
                else {
                    try {
                        this.superData.saveDataSet(id, roomsDC, numRows, "rooms");
                    }
                    catch {
                        reject(false);
                    }
                    resolve(true);
                }
            });
        });
    }
    getGeoLoc() {
        return new Promise((resolve, reject) => {
            let parsedData;
            let thatNameObj = {};
            let Promises = [];
            for (let url of this.urls) {
                Promises.push(new Promise((resolve2, reject2) => {
                    let index = this.urls.indexOf(url).toString();
                    let options = { host: "cs310.students.cs.ubc.ca", port: "11316", path: url };
                    http.get(options, (res) => {
                        res.setEncoding("utf8");
                        let rawData = "";
                        res.on("data", (chunk) => rawData += chunk);
                        res.on("end", () => {
                            try {
                                parsedData = JSON.parse(rawData);
                                let nameGeoArr = [];
                                nameGeoArr[0] = this.urlGeoCombo[index];
                                nameGeoArr[1] = parsedData;
                                resolve2(nameGeoArr);
                            }
                            catch (e) {
                                reject2(e);
                            }
                        });
                    }).on("error", (e) => {
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
    processBuilding(node) {
        let skip = false;
        if (node["nodeName"] !== "#text" || node["value"].trim().length === 0) {
            skip = true;
        }
        let keys = Object.keys(node);
        for (let key of keys) {
            if (key === "parentNode") {
                continue;
            }
            if (key !== "childNodes") {
                if (!skip && key !== "nodeName") {
                    if (this.count % 4 === 1) {
                        this.shortname = node[key].trim();
                    }
                    else if (this.count % 4 === 2) {
                        this.fullname = node[key].trim();
                    }
                    else if (this.count % 4 === 3) {
                        this.address = node[key].trim();
                    }
                    else {
                        let building = {};
                        building["shortname"] = this.shortname;
                        building["fullname"] = this.fullname;
                        building["address"] = this.address;
                        this.buildings[this.shortname] = [this.fullname, this.address];
                    }
                    this.count++;
                }
            }
            else {
                let childNodes = node["childNodes"];
                for (let childNode of childNodes) {
                    this.processBuilding(childNode);
                }
            }
        }
    }
    searchTbody(node) {
        if (node["nodeName"] === "tbody") {
            return node;
        }
        if (!("childNodes" in node)) {
            return null;
        }
        let childNodes = node["childNodes"];
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
    checkGeoError(buildingNode) {
        this.processBuilding(buildingNode);
        for (let key of Object.keys(this.buildings)) {
            let htmlAddress;
            htmlAddress = "/api/v1/project_team148/"
                + this.buildings[key][1].replace(/ /gi, "%20");
            this.urls.push(htmlAddress);
            this.urlGeoCombo[this.urls.indexOf(htmlAddress)] = key;
        }
    }
    getLinks(node) {
        if (node.attrs) {
            if (node.nodeName === "a") {
                node.attrs.forEach((value) => {
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
    getBuildings(zip2, buildingNode, id) {
        return new Promise((resolve, reject) => {
            let rooms = [];
            let Promises = [];
            let roomsInfoFilled = [];
            this.getLinks(buildingNode);
            this.checkGeoError(buildingNode);
            let file;
            for (let link of this.links) {
                file = link.substring(link.indexOf("/") + 1);
                let path = link.split("/");
                zip2.folder("rooms")?.forEach((relativePath, file2) => {
                    if ("rooms/" + file === file2.name) {
                        this.shortNames.push(path[4]);
                        Promises.push(file2.async("string"));
                    }
                });
            }
            Promise.all(Promises).then((building) => {
                let buildingCount = 0;
                let roomObjWithRoomsInfoFilled = [];
                for (let roomsOfABuilding of building) {
                    if (roomsOfABuilding.length === 0) {
                        continue;
                    }
                    roomsInfoFilled = this.getRooms(roomsOfABuilding, id);
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
                this.getGeoLoc().then((result) => {
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
    putInGeoLocInRoom(nameObj, roomObj) {
        let shortN = roomObj[Object.keys(roomObj)[1]];
        roomObj[Object.keys(roomObj)[5]] = nameObj[shortN]["lat"];
        roomObj[Object.keys(roomObj)[6]] = nameObj[shortN]["lon"];
    }
    getRooms(roomsOfABuilding, id) {
        let roomsInfo = this.parseRoomsInfo(roomsOfABuilding, id);
        return roomsInfo;
    }
    parseRoomsInfo(roomsInBuilding, id) {
        let roomLinks;
        let roomsInfoNew = [];
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
        return roomsInfoNew;
    }
    parseRoomInfo(room, id) {
        let roomInfo = {};
        let roomData = room.childNodes;
        let roomCons = (0, RoomHelper_1.roomInfoFunction)(roomInfo, roomData, id);
        let roomObj = roomCons.makeObject();
        return roomObj;
    }
}
exports.default = DataController;
//# sourceMappingURL=DataController.js.map