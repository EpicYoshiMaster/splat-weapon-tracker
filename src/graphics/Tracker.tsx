import React, { useState, useEffect, useMemo, useCallback, act } from 'react';
import { styled } from 'styled-components'
import { createRoot } from 'react-dom/client';
import { RecentWeapons } from './components/RecentWeapons'
import { useReplicant } from '../utils/use-replicant';
import { WeaponMode, DisplayMode } from '../types/types';
import { Weaponlist } from '../types/schemas';
import { standardWeapons, salmonWeapons, grizzcoWeapons, invertWeaponList, getWeaponFrequencies } from '../utils/WeaponDatabase';
import { UnseenWeapons } from './components/UnseenWeapons';
import { WeaponFrequencies } from './components/WeaponFrequencies';

const NumRecentWeapons = 6;

type ActiveAndFade = {
	active: DisplayMode;
	fade: boolean;
}

export function Tracker() {
	const [mode, setMode] = useReplicant<WeaponMode>('mode', {
		defaultValue: WeaponMode.Salmon
	});

	const [display, setDisplay] = useReplicant<DisplayMode>('display', {
		defaultValue: DisplayMode.None
	})

	const [fullscreen, setFullscreen] = useReplicant<boolean>('fullscreen', {
		defaultValue: false,
	})

	const [current, setCurrent] = useState<ActiveAndFade>({ active: DisplayMode.None, fade: false });

	const [lists, setLists] = useReplicant<Weaponlist>('weapons', {
		defaultValue: {
			standard: [],
			salmon: [],
			grizzco: []
		}
	})

	const weaponClasses = useMemo(() => {
		if(!mode) return [];

		switch(mode) {
			case WeaponMode.Standard: return standardWeapons;
			case WeaponMode.Salmon: return salmonWeapons;
			case WeaponMode.Grizzco: return grizzcoWeapons;
		}
	}, [mode])

	const activeList = useMemo(() => {
		if(!mode) return [];
		if(!lists) return [];

		switch(mode) {
			case WeaponMode.Standard: return lists.standard;
			case WeaponMode.Salmon: return lists.salmon;
			case WeaponMode.Grizzco: return lists.grizzco;
		}
	}, [mode, lists]);

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
		<StyledTracker>
			<Content>
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
			</Content>	
		</StyledTracker>
	);
}

const StyledTracker = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;	

	display: flex;
	
	align-items: flex-end;
	justify-content: flex-start;

	color: white;
	background-color: transparent;
`;

const Content = styled.div`
	position: relative;
	width: 600px;
	height: 500px;
`;

const root = createRoot(document.getElementById('root')!);
root.render(<Tracker />);