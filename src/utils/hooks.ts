import React, { useState, useEffect } from 'react';
import { View } from '../types/types';


interface UseWeaponViewProps {
	view: View;
	timeline: gsap.core.Timeline | undefined;
	timeScale?: number;
	reverseTimeScale?: number;
}

export const useWeaponView = ({ view, timeline, timeScale = 1, reverseTimeScale }: UseWeaponViewProps) => {
	const [active, setActive] = useState(false);

	useEffect(() => {
		if(!timeline) return;

		if(view.show && view.fade) {
			if(!active) {
				setActive(true);

				console.log("Setting active");

				timeline.timeScale(timeScale).play().then(() => {
					view.onFade();
				});
			}
		}
		else if(!view.show && view.fade) {
			if(active) {
				setActive(false);

				console.log("Setting inactive");

				timeline.timeScale(reverseTimeScale ? reverseTimeScale : timeScale).reverse().then(() => {
					view.onFade(); 
				});
			}
		}
	}, [view, active, timeline, timeScale, reverseTimeScale])

  return active;
}