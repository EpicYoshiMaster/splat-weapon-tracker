import React from 'react';
import { createRoot } from 'react-dom/client';
import { styled } from 'styled-components';
import { HeadText, SettingsButton } from './components/Layout';
import { BackgroundMode, WeaponMode } from '../types/types';
import { useReplicant } from '../utils/use-replicant';

//Enable/Disable Progress Bar
//Change background for getting screenshots

export function Settings() {
	const [mode, setMode] = useReplicant<WeaponMode>('mode', {
		defaultValue: WeaponMode.Salmon
	});

	const [progressBar, setProgressBar] = useReplicant<boolean>('progressBar', { defaultValue: true });

	const [background, setBackground] = useReplicant<BackgroundMode>('background', { defaultValue: BackgroundMode.Transparent });

	return (
		<Wrapper>
				<HeadText $content="Modes">Modes</HeadText>
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
	grid-template-columns: max-content 1fr;
	align-items: center;
	gap: 15px;
`;

const Row = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: row;
	gap: 5px;
`;

const root = createRoot(document.getElementById('root')!);
root.render(<Settings />);