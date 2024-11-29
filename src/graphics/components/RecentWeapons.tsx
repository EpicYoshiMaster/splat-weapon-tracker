import React, { useCallback, useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { getWeaponById, defaultWeapon, weaponImagePath } from "../../utils/WeaponDatabase"
import { FittedText } from "./FittedText";
import { gsap } from "gsap/gsap-core";
import { useGSAP } from '@gsap/react'
import { Weapon } from "../../types/types";

interface RecentWeaponsProps {
	show: boolean;
	max: number;
	recentIds: number[];
	onHideDisplay: () => void;
}

export const RecentWeapons: React.FC<RecentWeaponsProps> = ({ show, max, recentIds, onHideDisplay }) => {
	
	const [active, setActive] = useState(false);
	const container = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		//Transition in
		if(show && !active) {
			setActive(true);
			gsap.timeline()
			.set(".container", { opacity: 0 })
			.to(".container", { duration: 1, opacity: 1, ease: "power2.inOut" })
		}
		//Transition out
		else if(!show && active) {
			gsap.timeline()
			.set(".container", { opacity: 1 })
			.to(".container", { duration: 1, opacity: 0, ease: "power2.inOut" })
			.then(() => {
				setActive(false);
				onHideDisplay();
			})
		}
	}, { dependencies: [show, active], scope: container })

	return (
		<Wrapper ref={container} $display={active ? 'block' : 'none'}>
			<Column className="container">
			{
				Array.from(Array(max).keys()).map((index) => {

					let display = index < recentIds.length ? 'flex' : 'none';
					let weapon: Weapon = defaultWeapon;
					let weaponCount = 0;
					let colorTag = "";

					if(index < recentIds.length) {
						const id = recentIds[index];

						weapon = getWeaponById(id);

						if(weapon === defaultWeapon) {
							display = 'none';
						}

						weaponCount = recentIds.filter((weaponId, weaponIndex) => weaponIndex >= index && weaponId === weapon.id).length;
						colorTag = weapon.weaponClass.toLowerCase();
					}

					if(index === 0) {
						return (
						<TopWeaponRow 
							key={index} 
							$display={display} 
							$colorTag={colorTag}
							className="weapon">
							<WeaponImage src={`${weaponImagePath}${weapon.image}`} className="image" />
							<FittedText 
							text={`${weapon.name} (${weaponCount})`} 
							maxWidth={425} 
							align="left" 
							font="Blitz Main"
							outline={{ width: 10, colorTag: "text-outline" }} />
						</TopWeaponRow>
						)
					}

					return (
						<WeaponRow 
							key={index} 
							$display={display} 
							$colorTag={colorTag}
							className="weapon">
							<WeaponImage src={`${weaponImagePath}${weapon.image}`} className="image" />
							<FittedText 
								text={`${weapon.name} (${weaponCount})`} 
								maxWidth={475} 
								align="left" 
								font="Blitz Main"
								outline={{ width: 5, colorTag: "text-outline" }} />
						</WeaponRow>
					)
				})
			}
			</Column>
		</Wrapper>
	)
}

const Wrapper = styled.div<{ $display: string }>`
	display: ${({ $display }) => $display};
	position: relative;	
`;

const Column = styled.div`
	padding: 10px;
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;

	color: white;

	flex-direction: column;
	justify-content: flex-start;
	row-gap: 5px;

	//FOUC
	opacity: 0;
`;

const WeaponRow = styled.div<{ $colorTag: string, $display: string }>`
	position: relative;
	height: 65px;
	display: ${({ $display }) => $display};
	flex-direction: row;
	align-items: center;
	color: var(--text);
	font-size: 1.5rem;

	border: 3px solid var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `base` });
	background-color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `base`}-dark);

	border-radius: 0.5rem;
`;

const TopWeaponRow = styled(WeaponRow)`
	height: 135px;
	font-size: 3rem;
`;

const WeaponImage = styled.img`
	max-height: 100%;
	margin: 0 5px;
`;