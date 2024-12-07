import React, { useCallback, useMemo, useRef, useState } from "react"
import { styled } from "styled-components"
import { View, Weapon } from "../../types/types";
import { weaponImagePath } from "../../utils/WeaponDatabase";
import { fitSquaresToRectGrid } from "../../utils/utils";
import { WeaponView } from "./WeaponView";

interface UnseenWeaponsProps {
	view: View;
	remainingWeapons: Weapon[];
}

export const UnseenWeapons: React.FC<UnseenWeaponsProps> = ({ view, remainingWeapons }) => {

	const buildTimeline = useCallback((timeline: gsap.core.Timeline) => {
		return timeline.set(".content", { opacity: 0 })
			.set(".container", { opacity: 1 })
			.set(".container", { width: "0%", height: "0%", opacity: 0, scale: 0 })
			.to(".container", { duration: 0.25, opacity: 1, scale: 1 })
			.to(".container", { height: "100%" })
			.to(".container", { width: "100%" })
			.to(".content", { duration: 1.5, opacity: 1, ease: "power2.inOut" })
	}, []);

	const rectFit = useMemo(() => {
		return fitSquaresToRectGrid(570, 380, remainingWeapons.length)
	}, [remainingWeapons.length]);

	return (
		<WeaponView view={view} buildTimeline={buildTimeline} timeScale={1} reverseTimeScale={1.5}>
			<Wrapper>
				<Container className="container">
					<Content className="content">
						<TitleText $content={`Unseen Weapons`}>Unseen Weapons</TitleText>
						<WeaponList $columns={rectFit.columns} $width={Math.floor(rectFit.size)}>
						{remainingWeapons.length > 0 && 
							remainingWeapons.map((weapon, index) => {
								return (
									<WeaponImage  key={index} src={`${weaponImagePath}${weapon.image}`} />
								)
							})
						}
						{remainingWeapons.length <= 0 && (
							<TitleText $content="All Weapons Found! Hooray!">All Weapons Found! Hooray!</TitleText>
						)}
						</WeaponList>
					</Content>
				</Container>
			</Wrapper>
		</WeaponView>
		
	)
}

const Wrapper = styled.div`
	display: flex;
	position: relative;
	padding: 5px;	
	width: 100%;
	height: 100%;

	align-items: center;
`;

const Container = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	
	background-color: var(--unseen);
	border: 5px solid var(--unseen-border);
	border-radius: 0.5rem;

	//FOUC
	opacity: 0;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	padding: 5px;
	width: 100%;
	height: 100%;

	color: var(--text);
`;

const TitleText = styled.div<{ $content: string }>`
	position: relative;
	font-size: 2.75rem;	
	isolation: isolate;

	&::before {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		content: "${({ $content }) => $content}";
		-webkit-text-stroke: 10px var(--text-outline);
		z-index: -1;
	}
`;

const WeaponList = styled.div<{ $width: number, $columns: number }>`
	position: relative;
	padding: 0;
	width: 570px;
	height: 380px;
	display: grid;
	justify-content: space-evenly;
	text-align: center;
	grid-template-columns: repeat(${({ $columns }) => $columns}, ${({ $width }) => $width}px);
`;

const WeaponImage = styled.img`
	position: relative;
	max-width: 100%;
	aspect-ratio: 1/1;
`;