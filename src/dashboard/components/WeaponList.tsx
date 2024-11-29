import React from "react";
import { styled } from "styled-components";
import { WeaponClass } from "../../types/types";
import { HeadText, Button } from "./Layout";
import { weaponImagePath } from "../../utils/WeaponDatabase";

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
					
				const weaponCount = weaponIds.filter((id) => id === weapon.id).length;

				return (
				<WeaponWrapper key={index}>
					<WeaponButton 
					$size={weaponSize}
					$colorTag={weaponClass.name.toLowerCase()}
					onClick={() => { onClickWeapon(weapon.id); }}>
						<WeaponCountWrapper>
							<WeaponCount $colorTag={weaponClass.name.toLowerCase()} $content={`${weaponCount}`}>{weaponCount}</WeaponCount>
						</WeaponCountWrapper>
						<WeaponImage src={`${weaponImagePath}${weapon.image}`} alt={weapon.name} />
					</WeaponButton>
				</WeaponWrapper>
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

const WeaponWrapper = styled.div`
	position: relative;
	margin: 0 10px 10px 0;
`;

const WeaponButton = styled(Button)<{ $size: number }>`
	position: relative;
	margin: 0;
	padding: 5px;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	aspect-ratio: 1/1;
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