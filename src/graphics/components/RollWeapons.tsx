import React, { useCallback, useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { getWeaponById, defaultWeapon, weaponImagePath } from "../../utils/WeaponDatabase"
import { FittedText } from "./FittedText";
import { View, Weapon } from "../../types/types";
import { WeaponView } from "./WeaponView";

interface RollWeaponsProps {
	view: View;
	max: number;
	randomWeapons: number[];
}

export const RollWeapons: React.FC<RollWeaponsProps> = ({ view, max, randomWeapons }) => {

	const buildTimeline = useCallback((timeline: gsap.core.Timeline) => {
		return timeline.fromTo(".container", { opacity: 0 }, { 
			duration: 1, 
			opacity: 1, 
			ease: "power2.inOut"
		})
	}, []);

	return (
		<WeaponView view={view} buildTimeline={buildTimeline}>
			<Column className="container">
			{
				Array.from(Array(max).keys()).map((index) => {

					let display = index < randomWeapons.length ? 'flex' : 'none';
					let weapon: Weapon = defaultWeapon;
					let weaponCount = 0;
					let colorTag = "";

					if(index < randomWeapons.length) {
						const id = randomWeapons[index];

						weapon = getWeaponById(id);

						if(weapon === defaultWeapon) {
							display = 'none';
						}

						weaponCount = randomWeapons.filter((weaponId, weaponIndex) => weaponIndex >= index && weaponId === weapon.id).length;
						colorTag = weapon.weaponClass.toLowerCase();
					}

					return (
						<WeaponRow 
						key={index} 
						$display={display} 
						$colorTag={colorTag}
						className="weapon">
							<WeaponImage src={`${weaponImagePath}${weapon.image}`} className="image" />
							<FittedText 
							text={`${weapon.name}`} 
							maxWidth={475} 
							align="left" 
							font="Blitz Main"
							outline={{ width: 5, colorTag: "text-outline" }} />
						</WeaponRow>
					)
				})
			}
			</Column>
		</WeaponView>
	)
}

const Column = styled.div`
	padding: 10px;
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;

	color: white;

	flex-direction: column;
	justify-content: flex-start;
	row-gap: 6px;
`;

const WeaponRow = styled.div<{ $colorTag: string, $display: string }>`
	position: relative;
	height: 55px;
	display: ${({ $display }) => $display};
	flex-direction: row;
	align-items: center;
	color: var(--text);
	font-size: 1.75rem;

	border: 3px solid var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `base` });
	background-color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `base`}-dark);

	border-radius: 0.5rem;
`;

const WeaponImage = styled.img`
	max-height: 100%;
	margin: 0 5px;
`;