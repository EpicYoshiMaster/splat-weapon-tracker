export type View = {
	show: boolean;
	fade: boolean;
	fullscreen: boolean;
	onFade: () => void;
}

export type Weapon = {
	id: number;
	key: string;
	name: string;
	weaponClass: string;
	image: string;
	coop: boolean;
	grizzco: boolean;
	order: boolean;
	firstKit: boolean;
	secondKit: boolean;
	baseKit: boolean;
	cosmeticKit: boolean;
}

export type WeaponFilter = {
	weaponClasses: string[];
	firstKit: boolean;
	secondKit: boolean;
	baseKit: boolean;
	cosmeticKit: boolean;
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
	Grizzco = "GrizzcoOnly",
	Order = "SideOrder"
}

export enum BackgroundMode {
	Transparent = "Transparent",
	Black = "Black",
	White = "White"
}

export enum DisplayMode {
	Recent = "Recent",
	Unseen = "Unseen",
	Frequencies = "Frequencies",
	Rolls = "Rolls",
	None = "None"
}