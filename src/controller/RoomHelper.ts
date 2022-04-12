import Room from "./Room";

export function roomInfoFunction(roomInfo: any, roomData: any[], id: any): any {
	roomInfo["number"] = roomData[1].childNodes[1].childNodes[0]["value"].toString().trim();
	roomInfo["href"] = roomData[1].childNodes[1].attrs[0]["value"].trim();
	roomInfo["seats"] = Number(roomData[3].childNodes[0]["value"]);
	roomInfo["furniture"] = roomData[5].childNodes[0]["value"].trim();
	roomInfo["type"] = roomData[7].childNodes[0]["value"].trim();

	let roomCons = new Room("", "", "", "", "", 0, 0,
		0,"", "", "", id);
	roomCons.rooms_number = roomInfo["number"];
	roomCons.rooms_seats = roomInfo["seats"];
	roomCons.rooms_type = roomInfo["type"];
	roomCons.rooms_furniture = roomInfo["furniture"];
	roomCons.rooms_href = roomInfo["href"];
	return roomCons;
}
