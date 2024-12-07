import React, { useRef } from "react";
import { gsap } from "gsap/gsap-core";
import { View } from "../../types/types";
import { useGSAP } from "@gsap/react";
import { styled } from "styled-components";
import { useWeaponView } from "../../utils/hooks";

interface WeaponViewProps {
	view: View;
	children: React.ReactNode;
	buildTimeline: (timeline: gsap.core.Timeline, container: HTMLDivElement | null) => gsap.core.Timeline;
	timeScale?: number;
	reverseTimeScale?: number;
}

export const WeaponView: React.FC<WeaponViewProps> = ({ view, children, buildTimeline, timeScale, reverseTimeScale }) => {
	const timeline = useRef<gsap.core.Timeline>();
	const container = useRef<HTMLDivElement>(null);
	const active = useWeaponView({ view, timeline: timeline.current, timeScale, reverseTimeScale });

	useGSAP(() => {
		timeline.current = buildTimeline(gsap.timeline().fromTo(container.current, { display: 'none' }, { duration: 0.01, display: 'block' }), container.current).pause()
	}, { dependencies: [buildTimeline], scope: container })

	return (
		<ViewWrapper ref={container} $display={active ? 'block' : 'none'}>
			{children}
		</ViewWrapper>
	)
}

const ViewWrapper = styled.div<{ $display: string }>`
	position: relative;
	display: ${({ $display }) => $display};
	width: 100%;
	height: 100%;
`;