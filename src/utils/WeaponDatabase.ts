import Weapons from '../data/weapons.json'
import Classes from '../data/classes.json'
import { Weapon, WeaponClass, WeaponFilter, WeaponFrequency } from '../types/types'

const thirdKitOffset = 10000;

const createWeaponDatabase = (): [Weapon[], WeaponClass[]] =>  {
	const weapons: Weapon[] = [];
	const weaponClasses: WeaponClass[] = Classes;
	let skipIndex = 0; //Third kits require some jank to remain backwards compatible OKAY??

	Object.entries(Weapons).forEach(([key, value], index) => {
		const weapon: Weapon = { id: index - skipIndex, key: key, name: value, image: key, weaponClass: "", coop: false, grizzco: false, order: false, firstKit: false, secondKit: false, thirdKit: false, baseKit: false, cosmeticKit: false };

		const coopIndex = weapon.image.indexOf("_Coop");

		//Salmon Run
		if(coopIndex !== -1) {
			weapon.coop = true;
			weapon.firstKit = true;
			weapon.baseKit = true;

			weapon.image = weapon.image.substring(0, coopIndex);
		}

		//Grizzco Weapon
		if(key.includes("Bear")) {
			weapon.grizzco = true;
			weapon.firstKit = true;
			weapon.baseKit = true;
		}
		else if(coopIndex !== -1) {
			weapon.image = weapon.image + "_00";
		}

		//Side Order
		if(key.includes("_O")) {
			weapon.order = true;
			weapon.cosmeticKit = true;

			if(key.includes("_Oct")) {
				weapon.secondKit = true;
			}
			else {
				weapon.firstKit = true;
			}
		}

		//Hero Mode
		if(key.includes("_H", key.length - 2)) {
			weapon.cosmeticKit = true;
			weapon.firstKit = true;
		}

		if(key.includes("_00")) {
			weapon.firstKit = true;
			weapon.baseKit = true;
		}

		if(key.includes("_01")) {
			weapon.secondKit = true;
			weapon.baseKit = true;
		}

		if(key.includes("_02")) {
			//Who would have thought I'd be adding these
			weapon.thirdKit = true;
			weapon.baseKit = true;

			//Essentially make this a very big ID (to be unique) that can still be retraced back to where it was by removing the offset
			//if they somehow added FOURTH kits sometime later um. sorry have fun haha.
			//this is to preserve the original ID orders
			weapon.id += thirdKitOffset - 1;
			skipIndex += 1;
		}

		weapon.image = `Path_Wst_${weapon.image}.png`;

		if(weapon.grizzco) {
			//Display grizzco weapons separately
			weapon.weaponClass = weaponClasses[weaponClasses.length - 1].name;
			weaponClasses[weaponClasses.length - 1].weapons.push(weapon);
		}
		else {
			const classIndex = weaponClasses.findIndex((weaponClass) => {
				return weapon.key.includes(weaponClass.tag)
			})

			if(classIndex !== -1) {
				weapon.weaponClass = weaponClasses[classIndex].name;
				weaponClasses[classIndex].weapons.push(weapon);
			}
			else {
				console.log(`Failed weapon class sort for ${weapon.name}`);
			}
		}

		weapons.push(weapon);
	})

	return [weapons, weaponClasses];
}

type WeaponFunction = (weapon: Weapon) => boolean;

const filterWeapons = (classes: WeaponClass[], filter: WeaponFunction): WeaponClass[] => {
	return classes.map((weaponClass) => {
		return { ...weaponClass, weapons: weaponClass.weapons.filter(filter)}
	}).filter((weaponClass) => weaponClass.weapons.length > 0)
}

const weaponFilter = (weapon: Weapon, filter: WeaponFilter, weaponIds?: number[]) => {
	if(!weapon) return false;
	if(!filter.weaponClasses.includes(weapon.weaponClass)) return false;
	if(!filter.firstKit && weapon.firstKit) return false;
	if(!filter.secondKit && weapon.secondKit) return false;
	if(!filter.thirdKit && weapon.thirdKit) return false;
	if(!filter.baseKit && weapon.baseKit) return false;
	if(!filter.cosmeticKit && weapon.cosmeticKit) return false;
	if(!filter.unseen && weaponIds && !weaponIds.includes(weapon.id)) return false;
	if(!filter.seen && weaponIds && weaponIds.includes(weapon.id)) return false;

	return true;
}

export const filterWeaponsByProperties = (classes: WeaponClass[], filter: WeaponFilter, weaponIds?: number[]): WeaponClass[] => {
	return filterWeapons(classes, (weapon) => weaponFilter(weapon, filter, weaponIds))
}

const [weapons, weaponClasses] = createWeaponDatabase();

export const weaponImagePath = `/bundles/splat-weapon-tracker/images/weapons/`;

export const standardWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapon) => !weapon.coop && !weapon.grizzco);

export const salmonWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapons) => weapons.coop);

export const grizzcoWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapons) => weapons.grizzco);

export const orderWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapon) => weapon.order);

export const defaultWeapon: Weapon = {
	id: -1,
	key: "Dummy",
	name: "Dummy",
	weaponClass: "Unknown",
	image: "Dummy.png",
	coop: false,
	grizzco: false,
	order: false,
	firstKit: false,
	secondKit: false,
	thirdKit: false,
	baseKit: false,
	cosmeticKit: false
}

export const getWeaponClassNames = (): string[] => {
	return Classes.map((weaponClass) => {
		return weaponClass.name;
	})
}

export const getWeaponById = (id: number): Weapon => {
	const weapon = weapons.find((weapon) => weapon.id === id);

	if(weapon) return weapon;

	return defaultWeapon;
}

export const filterWeaponIdsByProperties = (weaponIds: number[], filter: WeaponFilter): number[] => {
	return weaponIds.filter((id) => {
		const weapon = getWeaponById(id);

		return weaponFilter(weapon, filter);
	})
}

//Returns all weapons within the given classes not found in ids
export const invertWeaponList = (weapons: WeaponClass[], ids: number[]): Weapon[] => {
	return weapons.flatMap((weaponClass) => {
		return weaponClass.weapons.filter(weapon => !ids.includes(weapon.id))
	})
}

export const getTotalNumWeapons = (weapons: WeaponClass[]): number => {
	return weapons.reduce((accum, weaponClass) => {
		return accum + weaponClass.weapons.length;
	}, 0)
}

export const getSeenWeapons = (weapons: WeaponClass[], ids: number[]): number => {
	return weapons.flatMap((weaponClass) => {
		return weaponClass.weapons.filter(weapon => ids.includes(weapon.id))
	}).length;
}

export const getWeaponCount = (weaponId: number, weaponIds: number[]) => {
	return weaponIds.filter((id) => id === weaponId).length;
}

export const getRandomWeapon = (weapons: WeaponClass[]): Weapon => {
	if(weapons.length <= 0) return defaultWeapon;

	const flatWeapons = weapons.flatMap((weapons) => {
		return weapons.weapons;
	});

	const randomWeaponIndex = Math.floor(Math.random() * flatWeapons.length);

	return flatWeapons[randomWeaponIndex];
}

const ellipsis = `\u22EF`;

export const getCompletionPercentage = (weapons: WeaponClass[], ids: number[]): number => {

	const totalWeapons = getTotalNumWeapons(weapons);
	const foundWeapons = getSeenWeapons(weapons, ids);

	return Math.min(100, Math.max(0, (foundWeapons / totalWeapons) * 100));
}

//Personally I would like to know a Better way to do this LOL
export const getWeaponFrequencies = (weapons: WeaponClass[], ids: number[]): WeaponFrequency[] => {
	const frequencies = weapons.flatMap((weaponClass) => {
		return weaponClass.weapons.map((weapon) => {
			return { weapon, count: ids.filter((id) => weapon.id === id).length};
		})
	}).sort((a, b) => {

		if(a.count === b.count) {
			const compareIdA = a.weapon.thirdKit ? a.weapon.id - thirdKitOffset + 0.5 : a.weapon.id;
			const compareIdB = b.weapon.thirdKit ? b.weapon.id - thirdKitOffset + 0.5 : b.weapon.id;

			return compareIdA - compareIdB;
		}
		else {
			return a.count - b.count;
		}
	 });

	//Condense by frequency, adding in blank counts between
	const min = frequencies.length > 0 ? frequencies[0].count : 0;
	const max = frequencies.length > 0 ? frequencies[frequencies.length - 1].count : 0;

	return Array.from(Array((max - min) + 1).keys(), (key) => key + min).map((count) => {
		let countText = `${count}`;

		const weaponsAtCount = frequencies.filter((freq) => freq.count === count).map((freq) => freq.weapon);

		if(weaponsAtCount.length <= 0) {
			const previousCountZero = count > 0 && frequencies.filter((freq) => freq.count === count - 1).length <= 0;
			const nextCountZero = count < max && frequencies.filter((freq) => freq.count === count + 1).length <= 0;

			//Notate long stretches of empty weapons to be filtered later
			if(previousCountZero && nextCountZero) {
				countText = ellipsis;
			}	
		}

		return { count: countText, weapons: weaponsAtCount}
	}).filter((frequency, index, array) => frequency.count !== ellipsis || (array[index + 1].count !== ellipsis))
}