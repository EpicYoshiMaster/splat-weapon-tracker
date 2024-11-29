import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { styled } from 'styled-components'
import { createRoot } from 'react-dom/client';
import { RecentWeapons } from './components/RecentWeapons'
import { useReplicant } from '@nodecg/react-hooks'
import { WeaponMode, DisplayMode } from '../types/types';
import { Weaponlist } from '../types/schemas';
import { standardWeapons, salmonWeapons, grizzcoWeapons, invertWeaponList, getWeaponFrequencies } from '../utils/WeaponDatabase';
import { UnseenWeapons } from './components/UnseenWeapons';
import { WeaponFrequencies } from './components/WeaponFrequencies';

const NumRecentWeapons = 6;

export function Tracker() {
	const [mode, setMode] = useReplicant<WeaponMode>('mode', {
		defaultValue: WeaponMode.Salmon
	});

	const [display, setDisplay] = useReplicant<DisplayMode>('display', {
		defaultValue: DisplayMode.None
	})

	const [activeDisplay, setActiveDisplay] = useState<DisplayMode>(DisplayMode.None);

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
		if(!display) return;

		if(display !== activeDisplay) {
			if(activeDisplay === DisplayMode.None) {
				setActiveDisplay(display);
			}
			else {
				//Hide the currently active display
				setActiveDisplay(DisplayMode.None);
			}
		}
	}, [display]);

	const onHideDisplay = useCallback(() => {
		if(!display) return;

		setActiveDisplay(display);
	}, [display]);

	return (
		<StyledTracker>
			<Content>
				<RecentWeapons 
					show={activeDisplay === DisplayMode.Recent} 
					max={NumRecentWeapons} 
					recentIds={activeList}
					onHideDisplay={onHideDisplay} />
				<UnseenWeapons 
					show={activeDisplay === DisplayMode.Unseen} 
					remainingWeapons={remainingList}
					onHideDisplay={onHideDisplay} />
				<WeaponFrequencies 
					show={activeDisplay === DisplayMode.Frequencies} 
					frequencies={weaponFrequencies}
					onHideDisplay={onHideDisplay} />
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