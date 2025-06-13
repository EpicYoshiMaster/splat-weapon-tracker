import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FittedText } from "./FittedText";
import { WeaponClass } from "../../types/types";
import { getSeenWeapons, getTotalNumWeapons, invertWeaponList } from "../../utils/WeaponDatabase";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { weaponImagePath } from "../../utils/WeaponDatabase";

interface ProgressBarProps {
	weaponClasses: WeaponClass[];
	weaponIds: number[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ weaponClasses, weaponIds }) => {
	const seenWeapons = useMemo(() => {
		return getSeenWeapons(weaponClasses, weaponIds);
	}, [weaponClasses, weaponIds]);

	const totalWeapons = useMemo(() => {
		return getTotalNumWeapons(weaponClasses);
	}, [weaponClasses]);

	const weaponPercent = useMemo(() => {
		return totalWeapons > 0 ? (seenWeapons / totalWeapons) * 100 : 100;
	}, [seenWeapons, totalWeapons])

	const remainingWeapons = useMemo(() => {
		return invertWeaponList(weaponClasses, weaponIds);
	}, [weaponClasses, weaponIds]);

	useGSAP(() => {
		gsap.set(".progress", { width: `0%`, '--progress': '#fd6d41e0', '--progress-dark': '#fe3f3ee0' })
	}, [])

	useGSAP(() => {
		if(weaponPercent < 100) {
			gsap.to(".progress", { width: `${weaponPercent}%`, '--progress': '#fd6d41e0', '--progress-dark': '#fe3f3ee0', duration: 2, ease: 'expo.out' });
		}
		else {
			gsap.to(".progress", { width: `${weaponPercent}%`, '--progress': '#e8b202e0', '--progress-dark': '#9c7e1adf', duration: 2, ease: 'expo.out' });
		}
	}, [weaponPercent])

	return (
		<Container>
			<Background>
				<Highlight></Highlight>
				<Progress className="progress"></Progress>
				<Text className="text">
					{remainingWeapons.length <= 5 && remainingWeapons.length > 0 && (
						<WeaponContainer>
							{remainingWeapons.map((weapon, index) => (
								<WeaponImage key={index} src={`${weaponImagePath}${weapon.image}`} />
							))}
						</WeaponContainer>
					)}
					<FittedText 
					text={`${seenWeapons}/${totalWeapons} Weapons (${totalWeapons > 0 ? Number(seenWeapons/totalWeapons).toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 2})  : `100.00%`})`} 
					maxWidth={1000} 
					align="right" 
					font="Blitz Main"
					outline={{ width: 5, colorTag: "text-outline" }} />
				</Text>
			</Background>
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: flex-end;
	color: var(--text);
	font-size: 1.7rem;
	width: 100%;
`;

const Background = styled.div`
	position: relative;
	height: 60px;
	width: 100%;
	background: linear-gradient(to bottom, #76723ce0, #76723ce0 15%, #44401fe0 20%, #44401fe0 45%, #150d01e0 65%, #150d01e0);
	border-radius: 5px;
	overflow: hidden;
`;

const scrollingRight = keyframes`
  	from{
      	background-position: 0 0;
  	}
  	to{
      	background-position: 60px 0;
  	}
`;

const Progress = styled.div`
	position: absolute;
	height: 100%;
	width: 0%;

	--progress: #fd6d41e0;
	--progress-dark: #fe3f3ee0;

	background: repeating-linear-gradient(45deg, var(--progress), var(--progress) 25%, var(--progress-dark) 25%, var(--progress-dark) 50%, var(--progress) 50%);
	background-size: 60px 60px;
	border-radius: 5px;
	background-attachment: fixed;
	transform-origin: center left;

	animation: ${scrollingRight} 2s linear infinite;
`;

const Text = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding-right: 10px;
	width: 100%;
	height: 100%;	
`;

const Highlight = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: linear-gradient(to bottom, #ffffff7f, transparent 10% 90%, #ffffff7f 100%);
	border-radius: 5px;
	z-index: 1;
`;

const WeaponContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding-right: 10px;
`;

const WeaponImage = styled.img`
	height: 75%;	
`;