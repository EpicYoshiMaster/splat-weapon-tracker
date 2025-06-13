import React, { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { styled } from 'styled-components';
import { HeadText, SettingsButton } from './components/Layout';
import { BackgroundMode, WeaponFilter, WeaponMode } from '../types/types';
import { useReplicant } from '../utils/use-replicant';
import { getWeaponClassNames } from '../utils/WeaponDatabase';

const weaponClassNames = getWeaponClassNames();

export function Settings() {
	const [mode, setMode] = useReplicant<WeaponMode>('mode', {
		defaultValue: WeaponMode.Salmon
	});

	const [filter, setFilter] = useReplicant<WeaponFilter>('filter', {
		defaultValue: { weaponClasses: weaponClassNames.slice(), firstKit: true, secondKit: true, thirdKit: true, baseKit: true, cosmeticKit: true, seen: true, unseen: true }
	})

	const setFilterWeaponClass = useCallback((weaponClass: string) => {
		if(filter.weaponClasses.includes(weaponClass)) {
			setFilter({ ...filter, weaponClasses: filter.weaponClasses.filter((value) => value !== weaponClass)})
		}
		else {
			setFilter({ ...filter, weaponClasses: [...filter.weaponClasses, weaponClass]})
		}
	}, [filter]);

	const [progressBar, setProgressBar] = useReplicant<boolean>('progressBar', { defaultValue: true });

	const [background, setBackground] = useReplicant<BackgroundMode>('background', { defaultValue: BackgroundMode.Transparent });

	return (
		<Wrapper>
				<HeadText $content="Mode">Mode</HeadText>
				<Row>
					<SettingsButton
					$content="Standard"
					$colorTag='standard'
					$selected={mode === WeaponMode.Standard}
					onClick={() => { setMode(WeaponMode.Standard); }}>Standard</SettingsButton>
					<SettingsButton 
					$content="Salmon Run"
					$colorTag='salmon'
					$selected={mode === WeaponMode.Salmon}
					onClick={() => { setMode(WeaponMode.Salmon); }}>Salmon Run</SettingsButton>
					<SettingsButton
					$content="Grizzco Only"
					$colorTag='grizzco'
					$selected={mode === WeaponMode.Grizzco}
					onClick={() => { setMode(WeaponMode.Grizzco); }}>Grizzco Only</SettingsButton>
					<SettingsButton
					$content="Side Order"
					$colorTag='order'
					$selected={mode === WeaponMode.Order}
					onClick={() => { setMode(WeaponMode.Order); }}>Side Order</SettingsButton>
				</Row>
				<HeadText $content="Filters">Filters</HeadText>
				<Row>
					{weaponClassNames.map((weaponClass, index) => (
						<SettingsButton
							key={index}
							$content={weaponClass}
							$colorTag={weaponClass.toLowerCase()}
							$selected={filter.weaponClasses.includes(weaponClass)}
							onClick={() => { setFilterWeaponClass(weaponClass);  }}>{weaponClass}</SettingsButton>
					))
					}
					<SettingsButton
						$content="First Kits"
						$colorTag='first'
						$selected={filter.firstKit}
						onClick={() => { setFilter({ ...filter, firstKit: !filter.firstKit }); }}>First Kits</SettingsButton>
					<SettingsButton
						$content="Second Kits"
						$colorTag='second'
						$selected={filter.secondKit}
						onClick={() => { setFilter({ ...filter, secondKit: !filter.secondKit }); }}>Second Kits</SettingsButton>
					<SettingsButton
						$content="Third Kits"
						$colorTag='third'
						$selected={filter.thirdKit}
						onClick={() => { setFilter({ ...filter, thirdKit: !filter.thirdKit }); }}>Third Kits</SettingsButton>
					<SettingsButton
						$content="Base Kits"
						$colorTag='standard'
						$selected={filter.baseKit}
						onClick={() => { setFilter({ ...filter, baseKit: !filter.baseKit }); }}>Base Kits</SettingsButton>
					<SettingsButton
						$content="Cosmetics"
						$colorTag='order'
						$selected={filter.cosmeticKit}
						onClick={() => { setFilter({ ...filter, cosmeticKit: !filter.cosmeticKit }); }}>Cosmetics</SettingsButton>
				</Row>
				
				<HeadText $content="Dashboard Filters">Dashboard Filters</HeadText>
				<Row>
					<SettingsButton
						$content="Unseen"
						$colorTag='reset'
						$selected={filter.unseen}
						onClick={() => { setFilter({ ...filter, unseen: !filter.unseen }); }}>Unseen</SettingsButton>
					<SettingsButton
						$content="Seen"
						$colorTag='import'
						$selected={filter.seen}
						onClick={() => { setFilter({ ...filter, seen: !filter.seen }); }}>Seen</SettingsButton>
				</Row>
				<HeadText $content="Progress Bar">Progress Bar</HeadText>
				<Row>
					<SettingsButton
					$content="Off"
					$colorTag='reset'
					$selected={!progressBar}
					onClick={() => { setProgressBar(false); }}>Off</SettingsButton>
					<SettingsButton 
					$content="On"
					$colorTag='import'
					$selected={progressBar}
					onClick={() => { setProgressBar(true); }}>On</SettingsButton>
				</Row>
				<HeadText $content="Background">Background</HeadText>
				<Row>
					<SettingsButton
					$content="Transparent"
					$colorTag='transparent'
					$selected={background === BackgroundMode.Transparent}
					onClick={() => { setBackground(BackgroundMode.Transparent); }}>Transparent</SettingsButton>
					<SettingsButton 
					$content="Black"
					$colorTag='black'
					$selected={background === BackgroundMode.Black}
					onClick={() => { setBackground(BackgroundMode.Black); }}>Black</SettingsButton>
					<SettingsButton
					$content="White"
					$colorTag='white'
					$selected={background === BackgroundMode.White}
					onClick={() => { setBackground(BackgroundMode.White); }}>White</SettingsButton>
				</Row>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	padding: 15px 5px;

	display: grid;
	grid-template-columns: 140px 1fr;
	align-items: center;
	text-align: right;
	gap: 15px;
`;

const Row = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 5px;
`;

const root = createRoot(document.getElementById('root')!);
root.render(<Settings />);