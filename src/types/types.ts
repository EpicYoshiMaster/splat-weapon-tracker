export type Weapon = {
	id: number;
	key: string;
	name: string;
	weaponClass: string;
	image: string;
	coop: boolean;
	grizzco: boolean;
}

export type WeaponFrequency = {
	weapons: Weapon[];
	count: string; //This is all the Grizzco Splatana's fault >:(
}

export type WeaponClass = {
	tag: string;
	name: string;
	weapons: Weapon[];
}

export type RectangleFit = {
	rows: number;
	columns: number;
	size: number;
}

export enum WeaponMode {
	Standard = "Standard",
	Salmon = "SalmonRun",
	Grizzco = "GrizzcoOnly"
}

export enum DisplayMode {
	Recent = "Recent",
	Unseen = "Unseen",
	Frequencies = "Frequencies",
	None = "None"
}