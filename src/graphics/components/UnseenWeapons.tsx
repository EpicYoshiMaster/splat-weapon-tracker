import React, { useMemo, useRef, useState } from "react"
import { styled } from "styled-components"
import { Weapon } from "../../types/types";
import { weaponImagePath } from "../../utils/WeaponDatabase";
import { fitSquaresToRectGrid } from "../../utils/utils";
import { gsap } from "gsap/gsap-core";
import { useGSAP } from "@gsap/react";

interface UnseenWeaponsProps {
	show: boolean;
	remainingWeapons: Weapon[];
	onHideDisplay: () => void;
}

export const UnseenWeapons: React.FC<UnseenWeaponsProps> = ({ show, remainingWeapons, onHideDisplay }) => {
	const [active, setActive] = useState(false);
	const container = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		//Transition in
		if(show && !active) {
			setActive(true);
			gsap.timeline()
			.set(".content", { opacity: 0 })
			.set(".container", { width: "0%", height: "0%", opacity: 0, scale: 0 })
			.to(".container", { duration: 0.25, opacity: 1, scale: 1 })
			.to(".container", { height: "100%" })
			.to(".container", { width: "100%" })
			.to(".content", { duration: 1.5, opacity: 1, ease: "power2.inOut" })
		}
		//Transition out
		else if(!show && active) {
			gsap.timeline()
			.set(".container", { width: "100%", height: "100%", opacity: 1 })
			.set(".content", { opacity: 1 })
			.to(".content", { opacity: 0 })
			.to(".container", { width: "0%" })
			.to(".container", { height: "0%" })
			.to(".container", { opacity: 0, scale: 0 })
			.then(() => {
				setActive(false);
				onHideDisplay();
			})
		}
	}, { dependencies: [show, active], scope: container })


	const rectFit = useMemo(() => {
		return fitSquaresToRectGrid(570, 380, remainingWeapons.length)
	}, [remainingWeapons.length]);

	return (
		<Wrapper ref={container} $display={active ? 'flex' : 'none'}>
			<Container className="container">
				<Content className="content">
					<TitleText $content={`Unseen Weapons`}>Unseen Weapons</TitleText>
					<WeaponList $columns={rectFit.columns} $width={Math.floor(rectFit.size)}>
					{
						remainingWeapons.map((weapon, index) => {
							return (
								<WeaponImage  key={index} src={`${weaponImagePath}${weapon.image}`} />
							)
						})
					}
					</WeaponList>
				</Content>
			</Container>
		</Wrapper>
	)
}

const Wrapper = styled.div<{ $display: string }>`
	display: ${({ $display }) => $display};
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
	padding: 0;
	width: 100%;
	height: 100%;
	display: grid;
	justify-content: space-evenly;
	grid-template-columns: repeat(${({ $columns }) => $columns}, ${({ $width }) => $width}px);
`;

const WeaponImage = styled.img`
	max-width: 100%;
	aspect-ratio: 1/1;
`;