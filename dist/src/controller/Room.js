"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(full, short, number, name, address, lat, lon, seats, type, furniture, href, id) {
        this.rooms_fullname = full;
        this.rooms_shortname = short;
        this.rooms_number = number;
        this.rooms_name = name;
        this.rooms_address = address;
        this.rooms_lat = lat;
        this.rooms_lon = lon;
        this.rooms_seats = seats;
        this.rooms_type = type;
        this.rooms_furniture = furniture;
        this.rooms_href = href;
        this.id = id;
    }
    makeObject() {
        let keyf = this.id + "_fullname";
        let keys = this.id + "_shortname";
        let keynum = this.id + "_number";
        let keyname = this.id + "_name";
        let keyaddr = this.id + "_address";
        let keylat = this.id + "_lat";
        let keylon = this.id + "_lon";
        let keyseats = this.id + "_seats";
        let keytype = this.id + "_type";
        let keyfur = this.id + "_furniture";
        let keyhref = this.id + "_href";
        let roomObject = {
            [keyf]: this.rooms_fullname,
            [keys]: this.rooms_shortname,
            [keynum]: this.rooms_number,
            [keyname]: this.rooms_name,
            [keyaddr]: this.rooms_address,
            [keylat]: this.rooms_lat,
            [keylon]: this.rooms_lon,
            [keyseats]: this.rooms_seats,
            [keytype]: this.rooms_type,
            [keyfur]: this.rooms_furniture,
            [keyhref]: this.rooms_href
        };
        return roomObject;
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map