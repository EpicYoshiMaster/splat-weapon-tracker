import React from "react";
import styled from "styled-components";
import { HeadText, Button } from "./Layout";
import { weaponImagePath } from "../../utils/WeaponDatabase";
import { Weapon } from "../../types/types";

interface WeaponButtonProps {
	weapon: Weapon;
	size: number;
	numberDisplay?: number;
	marginRight: boolean;
	marginBottom: boolean;
	onClick: (weaponId: number) => void;
}

export const WeaponButton: React.FC<WeaponButtonProps> = ({ weapon, size, numberDisplay, marginRight, marginBottom, onClick }) => {
	return (
	<Wrapper $marginRight={marginRight} $marginBottom={marginBottom}>
		<ButtonWeapon 
		$size={size}
		$colorTag={weapon.weaponClass.toLowerCase()}
		onClick={() => { onClick(weapon.id); }}>
			{numberDisplay !== undefined && (
				<NumberWrapper>
					<NumberText $colorTag={weapon.weaponClass.toLowerCase()} $content={`${numberDisplay}`}>{numberDisplay}</NumberText>
				</NumberWrapper>
			)}
			<Image src={`${weaponImagePath}${weapon.image}`} alt={weapon.name} />
		</ButtonWeapon>
	</Wrapper>
	)
}

const Wrapper = styled.div<{ $marginRight: boolean, $marginBottom: boolean }>`
	position: relative;

	margin: 0;
	margin-right: ${({ $marginRight }) => $marginRight ? `10px` : `0`};
	margin-bottom: ${({ $marginBottom }) => $marginBottom ? `10px` : `0`};
`;

const ButtonWeapon = styled(Button)<{ $size: number }>`
	position: relative;
	margin: 0;
	padding: 5px;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	aspect-ratio: 1/1;
`;

const NumberWrapper = styled.div`
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

const NumberText = styled(HeadText)`
	position: relative;
	padding: 0;
	margin: 0;

	font-size: 1rem;
`;

const Image = styled.img`
	max-width: 100%;
`;