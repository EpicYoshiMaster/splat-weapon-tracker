import React from "react";
import { styled } from "styled-components";
import { Button, HeadText } from "./Layout";
import { getWeaponById, weaponImagePath } from "../../utils/WeaponDatabase";
import { WeaponButton } from "./WeaponButton";

interface RecentListProps {
	weaponIds: number[];
	onClickWeapon: (index: number) => void;
}

export const RecentList: React.FC<RecentListProps> = ({ weaponIds, onClickWeapon }) => {
	return (
		<Column>
		{
			weaponIds && weaponIds.map((id, index) => {
				const weapon = getWeaponById(id);

				if(!weapon) {
					return <div key={index}>Error obtaining weapon {id}</div>
				}

				const colorTag = weapon.weaponClass.toLowerCase();
				const weaponNumber = weaponIds.filter((weaponId, weaponIndex) => weaponIndex >= index && weaponId === id).length;

				return (
				<WeaponButton 
					key={index}
					weapon={weapon}
					size={100}
					numberDisplay={weaponNumber}
					marginRight={false}
					marginBottom={true}
					onClick={() => { onClickWeapon(index); }}
				/>
				)
			})
		}
		</Column>
	)
}

const Column = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	//If too short, the full left column will become scrollable instead of just the recent list
	overflow: visible;

	@media screen and (min-height: 950px) {
		overflow: auto;
	}
`;

const WeaponCountWrapper = styled.div`
	position: absolute;
	padding: 8px;
	margin: 0;

	top: 0;
	right: 0;
	bottom: 0;
	left: 0;

	width: 100%;
	height: 100%;


	display: flex;
	flex-direction: row;

	align-items: flex-start;
	justify-content: flex-start;
`;

const WeaponCount = styled(HeadText)`
	position: relative;
	padding: 0;
	margin: 0;

	font-size: 1rem;
`;

const WeaponImage = styled.img`
	max-width: 100%;
`;