import React, { useCallback } from "react"
import styled from "styled-components"
import { getWeaponById, defaultWeapon, weaponImagePath } from "../../utils/WeaponDatabase"
import { FittedText } from "./FittedText";
import { View, Weapon } from "../../types/types";
import { WeaponView } from "./WeaponView";

interface RecentWeaponsProps {
	view: View;
	max: number;
	recentIds: number[];
}

//#C87500 00
//#EBFF2A FF

export const RecentWeapons: React.FC<RecentWeaponsProps> = ({ view, max, recentIds }) => {

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
							//425 - 65
							maxWidth={425} 
							align="left" 
							font="Blitz Main"
							outline={{ width: 10, colorTag: "text-outline" }} />
							{/*<TrophyImage src="/bundles/splat-weapon-tracker/images/icons/Trophy_Gold.png" />*/}
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
							//475 - 15
							maxWidth={475} 
							align="left" 
							font="Blitz Main"
							outline={{ width: 5, colorTag: "text-outline" }} />
							{/*<TrophyImage src="/bundles/splat-weapon-tracker/images/icons/Trophy_Silver.png" />*/}
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
	row-gap: 5px;
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

const TrophyImage = styled.img`
	max-height: 40%;
	margin: 0 5px;	
`;