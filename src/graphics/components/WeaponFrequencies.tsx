import React, { useCallback } from "react";
import { styled, css } from "styled-components";
import { View, WeaponFrequency } from "../../types/types";
import { weaponImagePath } from "../../utils/WeaponDatabase";
import { fitSquaresToRectGrid } from "../../utils/utils";
import { WeaponView } from "./WeaponView";

interface WeaponFrequenciesProps {
	view: View;
	frequencies: WeaponFrequency[];
}

const GridWidth = 570;
const GridHeight = 380 - 32;

export const WeaponFrequencies: React.FC<WeaponFrequenciesProps> = ({ view, frequencies }) => {

	const buildTimeline = useCallback((timeline: gsap.core.Timeline) => {
		return timeline.set(".content", { opacity: 0 })
			.set(".container", { opacity: 1 })
			.set(".container", { width: "0%", height: "0%", opacity: 0, scale: 0 })
			.to(".container", { duration: 0.5, opacity: 1, scale: 1 })
			.to(".container", { height: "100%" })
			.to(".container", { width: "100%" })
			.to(".content", { duration: 1.5, opacity: 1, ease: "power2.inOut" })
	}, []);

	return (
		<WeaponView view={view} buildTimeline={buildTimeline} timeScale={1} reverseTimeScale={1.5}>
			<Wrapper>
				<Container className="container">
					<Content className="content">
						<TitleText $content="Weapon Frequencies">Weapon Frequencies</TitleText>
						<Frequencies>
						{frequencies.map((freq, index) => {
							const rectFit = fitSquaresToRectGrid(
								GridWidth / frequencies.length, 
								GridHeight, 
								freq.weapons.length);

							return (
								<FrequencyColumn key={index}>
									<WeaponColumn $last={index === frequencies.length - 1}>
									{freq.weapons.map((weapon, index) => {

										return (
										<WeaponImage $width={Math.floor(rectFit.size)} key={index} src={`${weaponImagePath}${weapon.image}`} />
										)
									})
									}
									</WeaponColumn>
									<CountWrapper>
										<Count $content={`${freq.count}`}>{freq.count}</Count>
									</CountWrapper>
								</FrequencyColumn>
							)
						})}
						</Frequencies>
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
	
	background-color: var(--frequencies);
	border: 5px solid var(--frequencies-border);
	border-radius: 0.5rem;

	width: 100%;
	height: 100%;

	//FOUC
	opacity: 0;
`;

const Content = styled.div`
	display: grid;
	grid-template-rows: max-content 1fr;
	align-items: center;
	position: relative;
	padding: 5px;

	width: 100%;
	height: 100%;

	color: var(--text);
`;

const TitleText = styled.div<{ $content: string }>`
	text-align: center;
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

const Frequencies = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
`;

const FrequencyColumn = styled.div`
	position: relative;
	height: 100%;
	width: 100%;
	flex-basis: 0;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
`;

const WeaponColumn = styled.div<{ $last: boolean }>`
	position: relative;
	width: 100%;
	height: ${GridHeight}px;

	display: flex;
	flex-direction: column-reverse;
	flex-wrap: wrap;
	align-items: center;

	${({ $last }) => $last ? css`` : css`border-right: 1px solid var(--frequencies-divider);`}
`;

const WeaponImage = styled.img<{ $width: number }>`
	position: relative;
	max-width: ${({ $width }) => $width}px;
	aspect-ratio: 1/1;
`;

const CountWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: center;
`;

const Count = styled.div<{ $content: string }>`
	position: relative;
	text-align: center;
	font-size: 1rem;	

	isolation: isolate;

	&::before {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		content: "${({ $content }) => $content}";
		-webkit-text-stroke: 8px var(--text-outline);
		z-index: -1;
	}
`;