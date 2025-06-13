import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled } from 'styled-components'
import { createRoot } from 'react-dom/client';
import { RecentWeapons } from './components/RecentWeapons'
import { useReplicant } from '../utils/use-replicant';
import { WeaponMode, DisplayMode, BackgroundMode, WeaponFilter, WeaponClass } from '../types/types';
import { Weaponlist } from '../types/schemas/weaponlist';
import { standardWeapons, salmonWeapons, grizzcoWeapons, invertWeaponList, getWeaponFrequencies, getRandomWeapon, getCompletionPercentage, orderWeapons, filterWeaponIdsByProperties, getWeaponClassNames, filterWeaponsByProperties } from '../utils/WeaponDatabase';
import { UnseenWeapons } from './components/UnseenWeapons';
import { WeaponFrequencies } from './components/WeaponFrequencies';
import { RollWeapons } from './components/RollWeapons';
import { random } from 'gsap';
import { ProgressBar } from './components/ProgressBar';

const NumRecentWeapons = 6;

type ActiveAndFade = {
	active: DisplayMode;
	fade: boolean;
}

export function Tracker() {
	const [mode, setMode] = useReplicant<WeaponMode>('mode', {
		defaultValue: WeaponMode.Salmon
	});

	const [filter, setFilter] = useReplicant<WeaponFilter>('filter', {
		defaultValue: { weaponClasses: getWeaponClassNames().slice(), firstKit: true, secondKit: true, baseKit: true, cosmeticKit: true, seen: true, unseen: true }
	})

	const [progressBar, setProgressBar] = useReplicant<boolean>('progressBar', { defaultValue: true });

	const [background, setBackground] = useReplicant<BackgroundMode>('background', { defaultValue: BackgroundMode.Transparent });

	const [display, setDisplay] = useReplicant<DisplayMode>('display', {
		defaultValue: DisplayMode.None
	})

	const [fullscreen, setFullscreen] = useReplicant<boolean>('fullscreen', {
		defaultValue: false,
	})

	const [numWeaponRolls, setNumWeaponRolls] = useReplicant<number>('weaponRolls', { defaultValue: 4 });
	const [randomWeapons, setRandomWeapons] = useReplicant<number[]>('randomWeapons', { defaultValue: [0, 0, 0, 0, 0, 0, 0, 0]});

	const [current, setCurrent] = useState<ActiveAndFade>({ active: DisplayMode.None, fade: false });

	const [lists, setLists] = useReplicant<Weaponlist>('weapons', {
		defaultValue: {
			standard: [],
			salmon: [],
			grizzco: [],
			order: []
		}
	})

	const backgroundColor = useMemo(() => {
		if(!background) return "transparent";

		switch(background) {
			case BackgroundMode.Transparent: return "transparent";
			case BackgroundMode.Black: return "#000000";
			case BackgroundMode.White: return "#ffffff";
		}
	}, [background])

	const activeList = useMemo(() => {
		if(!mode) return [];
		if(!lists) return [];

		let weaponList;

		switch(mode) {
			case WeaponMode.Standard: weaponList = lists.standard; break;
			case WeaponMode.Salmon: weaponList = lists.salmon; break;
			case WeaponMode.Grizzco: weaponList = lists.grizzco; break;
			case WeaponMode.Order: weaponList = lists.order; break;
		}

		return filterWeaponIdsByProperties(weaponList, filter);
	}, [mode, lists, filter]);

	const weaponClasses: WeaponClass[] = useMemo(() => {
		if(!mode) return [];

		let selectedClasses;

		switch(mode) {
			case WeaponMode.Standard: selectedClasses = standardWeapons; break;
			case WeaponMode.Salmon: selectedClasses = salmonWeapons; break;
			case WeaponMode.Grizzco: selectedClasses = grizzcoWeapons; break;
			case WeaponMode.Order: selectedClasses = orderWeapons; break;
		}

		return filterWeaponsByProperties(selectedClasses, filter);
	}, [mode, filter])

	const remainingList = useMemo(() => {
		return invertWeaponList(weaponClasses, activeList);
	}, [weaponClasses, activeList]);

	const weaponFrequencies = useMemo(() => {
		return getWeaponFrequencies(weaponClasses, activeList);
	}, [weaponClasses, activeList]);

	useEffect(() => {
		if(display === DisplayMode.None) return;

		if(display !== current.active && !current.fade) {
			//Nothing active, fade the current in
			if(current.active === DisplayMode.None) {
				console.log(`TRACKER - Fading In: Display: ${display}, Active: ${current.active}, Fade: ${current.fade}`);
				setCurrent({ active: display, fade: true });
			}
			else {
				//Something is active, fade the current out
				console.log(`TRACKER - Fading Out Current: Display: ${display}, Active: ${current.active}, Fade: ${current.fade}`);
				setCurrent((current) => { return { ...current, fade: true } });
			}
		}

	}, [display, current])

	const onFade = useCallback(() => {
		if(display === DisplayMode.None) return;

		if(current.active === display) {
			console.log(`ONFADE - Fade In Complete. PREV STATE: Display: ${display}, Active: ${current.active}, Fade: ${current.fade}`);
			setCurrent((current) => { return { ...current, fade: false } } );
		}
		else {
			console.log(`ONFADE - Fading In New Current: Display: ${display}, Active: ${current.active}, Fade: ${current.fade}`);
			setCurrent({ active: display, fade: true });
		}

	}, [current, display]);

	return (
		<StyledTracker $background={backgroundColor}>
			<Content>
				<UpperOverlay>
					{progressBar && (
						<ProgressBar weaponClasses={weaponClasses} weaponIds={activeList} />
					)}
				</UpperOverlay>
				<RecentWeapons 
					view={{ 
						show: display === DisplayMode.Recent, 
						fade: current.active === DisplayMode.Recent && current.fade, 
						fullscreen, 
						onFade 
					}}

					max={NumRecentWeapons} 
					recentIds={activeList} />				
				<WeaponFrequencies 
					view={{ 
						show: display === DisplayMode.Frequencies, 
						fade: current.active === DisplayMode.Frequencies && current.fade, 
						fullscreen, 
						onFade 
					}}

					frequencies={weaponFrequencies} />
				<UnseenWeapons 
					view={{ 
						show: display === DisplayMode.Unseen, 
						fade: current.active === DisplayMode.Unseen && current.fade, 
						fullscreen, 
						onFade 
					}}

					remainingWeapons={remainingList} />

				<RollWeapons
					view={{ 
						show: display === DisplayMode.Rolls, 
						fade: current.active === DisplayMode.Rolls && current.fade, 
						fullscreen, 
						onFade 
					}}

					max={numWeaponRolls} 
					randomWeapons={randomWeapons} />
			</Content>	
		</StyledTracker>
	);
}

const StyledTracker = styled.div<{ $background: string }>`
	position: relative;
	width: 1920px;
	height: 1080px;	

	display: flex;
	
	align-items: flex-end;
	justify-content: flex-start;

	color: white;
	background-color: ${({ $background }) => $background};
`;

const Content = styled.div`
	position: relative;
	width: 600px;
	height: 500px;
`;

const UpperOverlay = styled.div`
	position: absolute;
	bottom: 100%;
	padding: 0 10px;
	width: 100%;
`;

const root = createRoot(document.getElementById('root')!);
root.render(<Tracker />);