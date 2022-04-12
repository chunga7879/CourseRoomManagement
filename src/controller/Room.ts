export default class Room {
	public rooms_fullname: string;
	public rooms_shortname: string;
	public rooms_number: string;
	public rooms_name: string;
	public rooms_address: string;
	public rooms_lat: number;
	public rooms_lon: number;
	public rooms_seats: number;
	public rooms_type: string;
	public rooms_furniture: string;
	public rooms_href: string;
	public id: string;

	constructor(
		full: string,
		short: string,
		number: string,
		name: string,
		address: string,
		lat: number,
		lon: number,
		seats: number,
		type: string,
		furniture: string,
		href: string,
		id: string
	) {
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

	public makeObject(): any {
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
