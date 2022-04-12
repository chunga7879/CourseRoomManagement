"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomInfoFunction = void 0;
const Room_1 = __importDefault(require("./Room"));
function roomInfoFunction(roomInfo, roomData, id) {
    roomInfo["number"] = roomData[1].childNodes[1].childNodes[0]["value"].toString().trim();
    roomInfo["href"] = roomData[1].childNodes[1].attrs[0]["value"].trim();
    roomInfo["seats"] = Number(roomData[3].childNodes[0]["value"]);
    roomInfo["furniture"] = roomData[5].childNodes[0]["value"].trim();
    roomInfo["type"] = roomData[7].childNodes[0]["value"].trim();
    let roomCons = new Room_1.default("", "", "", "", "", 0, 0, 0, "", "", "", id);
    roomCons.rooms_number = roomInfo["number"];
    roomCons.rooms_seats = roomInfo["seats"];
    roomCons.rooms_type = roomInfo["type"];
    roomCons.rooms_furniture = roomInfo["furniture"];
    roomCons.rooms_href = roomInfo["href"];
    return roomCons;
}
exports.roomInfoFunction = roomInfoFunction;
//# sourceMappingURL=RoomHelper.js.map