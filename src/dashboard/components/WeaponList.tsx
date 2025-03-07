import React from "react";
import { styled } from "styled-components";
import { WeaponClass } from "../../types/types";
import { HeadText, Button } from "./Layout";
import { WeaponButton } from "./WeaponButton";
import { getWeaponCount } from "../../utils/WeaponDatabase";

interface WeaponListProps {
	weaponClass: WeaponClass;
	weaponIds: number[];
	weaponSize: number;
	onClickWeapon: (id: number) => void;
}

export const WeaponList: React.FC<WeaponListProps> = ({ weaponClass, weaponIds, weaponSize, onClickWeapon }) => {

	return (
		<Wrapper $size={weaponSize}>
			<HeadWrapper>
				<HeadText 
				$colorTag={weaponClass.name.toLowerCase()}
				$content={weaponClass.name}>
					{weaponClass.name}
				</HeadText>
			</HeadWrapper>
			<Row>
			{weaponClass.weapons.map((weapon, index) => {

				return (
					<WeaponButton 
					key={index} 
					weapon={weapon}
					size={weaponSize}
					numberDisplay={getWeaponCount(weapon.id, weaponIds)}
					onClick={onClickWeapon}
					marginRight={true}
					marginBottom={true}
					/>
				)
			})}
			</Row>
		</Wrapper>
	)
}

const Wrapper = styled.div<{ $size: number }>`
	position: relative;
	overflow: auto;
`;

const Row = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
`;

const HeadWrapper = styled.div`
	position: relative;
	padding-left: 5px;	
`;