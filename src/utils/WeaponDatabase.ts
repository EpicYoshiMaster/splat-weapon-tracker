import Weapons from '../data/weapons.json'
import Classes from '../data/classes.json'
import { Weapon, WeaponClass, WeaponFrequency } from '../types/types'

const createWeaponDatabase = (): [Weapon[], WeaponClass[]] =>  {
	const weapons: Weapon[] = [];
	const weaponClasses: WeaponClass[] = Classes;

	Object.entries(Weapons).forEach(([key, value], index) => {
		const weapon: Weapon = { id: index, key: key, name: value, image: key, weaponClass: "", coop: false, grizzco: false};

		const coopIndex = weapon.image.indexOf("_Coop");

		if(coopIndex !== -1) {
			weapon.coop = true;

			weapon.image = weapon.image.substring(0, coopIndex);
		}

		if(key.includes("Bear")) {
			weapon.grizzco = true;
		}
		else if(coopIndex !== -1) {
			weapon.image = weapon.image + "_00";
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

const filterWeapons = (classes: WeaponClass[], filter: WeaponFunction) => {
	return classes.map((weaponClass) => {
		return { ...weaponClass, weapons: weaponClass.weapons.filter(filter)}
	}).filter((weaponClass) => weaponClass.weapons.length > 0)
}

const [weapons, weaponClasses] = createWeaponDatabase();

export const weaponImagePath = `/bundles/splat-weapon-tracker/images/weapons/`;

export const standardWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapon) => !weapon.coop && !weapon.grizzco);

export const salmonWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapons) => weapons.coop);

export const grizzcoWeapons: WeaponClass[] = filterWeapons(weaponClasses, (weapons) => weapons.grizzco);

export const defaultWeapon: Weapon = {
	id: -1,
	key: "Dummy",
	name: "Dummy",
	weaponClass: "Unknown",
	image: "Dummy.png",
	coop: false,
	grizzco: false
}

export const getWeaponById = (id: number): Weapon => {
	if(id >= 0 && id < weapons.length) {
		return weapons[id];
	}

	return defaultWeapon;
}

//Returns all weapons within the given classes not found in ids
export const invertWeaponList = (weapons: WeaponClass[], ids: number[]): Weapon[] => {
	return weapons.flatMap((weaponClass) => {
		return weaponClass.weapons.filter(weapon => !ids.includes(weapon.id))
	})
}

//Personally I would like to know a Better way to do this LOL
export const getWeaponFrequencies = (weapons: WeaponClass[], ids: number[]): WeaponFrequency[] => {
	const frequencies = weapons.flatMap((weaponClass) => {
		return weaponClass.weapons.map((weapon) => {
			return { weapon, count: ids.filter((id) => weapon.id === id).length};
		})
	}).sort((a, b) => a.count === b.count ? a.weapon.id - b.weapon.id : a.count - b.count);

	//Condense by frequency, adding in blank counts
	const max = frequencies.length > 0 ? frequencies[frequencies.length - 1].count : 0;

	return Array.from(Array(max + 1).keys()).map((count) => {
		return { count, weapons: frequencies.filter((freq) => freq.count === count).map((freq) => freq.weapon)}
	})
}