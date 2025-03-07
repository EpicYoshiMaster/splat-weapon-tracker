import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { styled } from 'styled-components';
import { standardWeapons, salmonWeapons, grizzcoWeapons, defaultWeapon, getRandomWeapon, weaponImagePath } from '../utils/WeaponDatabase'
import { HeadText, OutlineButton, Input, SelectButton } from './components/Layout'
import { useReplicant } from '../utils/use-replicant';
import { DisplayMode, Weapon, WeaponMode } from '../types/types';
import { Weaponlist } from '../types/schemas/weaponlist';
import { Listexport } from '../types/schemas/listexport';
import { WeaponList } from './components/WeaponList';
import { RecentList } from './components/RecentList';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import { CollapseContainer } from './components/CollapseContainer';
import { RollWeapons } from './components/RollWeapons';

export function WeaponTracker() {
	const [mode, setMode] = useReplicant<WeaponMode>('mode', {
		defaultValue: WeaponMode.Salmon
	});

	const [display, setDisplay] = useReplicant<DisplayMode>('display', {
		defaultValue: DisplayMode.Recent
	})

	const [lists, setLists] = useReplicant<Weaponlist>('weapons', {
		defaultValue: {
			standard: [],
			salmon: [],
			grizzco: []
		}
	})

	const [numWeaponRolls, setNumWeaponRolls] = useReplicant<number>('weaponRolls', { defaultValue: 4 });
	const [randomWeapons, setRandomWeapons] = useReplicant<number[]>('randomWeapons', { defaultValue: [0, 0, 0, 0, 0, 0, 0, 0] });

	const [importError, setImportError] = useState("");
	const errorTimeout = useRef<number | null>(null);

	useEffect(() => {
		if(importError !== "") {
			errorTimeout.current = window.setTimeout(() => { setImportError(""); }, 10000);
		}

		return () => {
			if(errorTimeout.current) {
				window.clearInterval(errorTimeout.current);
				errorTimeout.current = null;
			}
		}
	}, [importError])

	const weaponSize = useMemo(() => {
		if(!mode) return 0;

		switch(mode) {
			case WeaponMode.Standard: return 85;
			case WeaponMode.Salmon: return 100;
			case WeaponMode.Grizzco: return 100;
			default: return 0;
		}
	}, [mode]);

	const resetList = useCallback(() => {
		if(!mode) return;
		if(!lists) return;

		switch(mode) {
			case WeaponMode.Standard: setLists({ ...lists, standard: []}); break;
			case WeaponMode.Salmon: setLists({ ...lists, salmon: []}); break;
			case WeaponMode.Grizzco: setLists({ ...lists, grizzco: []}); break;
		}
	}, [mode, lists]);

	const importList = useCallback((acceptedFiles: File[]) => {
		
		if(!lists) {
			setImportError("The lists replicant is undefined (this should not occur)");
			return;
		}

		if(acceptedFiles.length > 1)
		{
			setImportError("Only one settings file can be imported at a time.");
			return;
		}

		if(acceptedFiles.length == 0)
		{
			setImportError("An unknown issue occurred while trying to load the file.");
			return;
		}

		const [ file ] = acceptedFiles;

		file.text();

		if(!file.name.endsWith('.json'))
		{
			setImportError("List file must end in .json");
			return;
		}

		file.text().then((value: string) => {
			try {
				const importedJSON: Listexport = JSON.parse(value);

				if(importedJSON.mode && importedJSON.weaponIds)
				{
					switch(importedJSON.mode) {
						case WeaponMode.Standard: setLists({ ...lists, standard: importedJSON.weaponIds}); break;
						case WeaponMode.Salmon: setLists({ ...lists, salmon: importedJSON.weaponIds}); break;
						case WeaponMode.Grizzco: setLists({ ...lists, grizzco: importedJSON.weaponIds}); break;
						default: setImportError(`List file contained unknown Weapon Mode "${importedJSON.mode}"`);
					}
				}
				else
				{
					setImportError("The file provided failed to be matched as a weapon list file.");
				}
			} catch (error) {
				setImportError(`The weapon list file could not be read: ${error}.`);
			}
		}).catch((err) => {
			setImportError(`The weapon list file could not be read: ${err}.`);
		})

	}, [lists]);

	const { getRootProps, getInputProps, open } = useDropzone({ onDrop: importList, accept: { 'application/json': ['.json'] } , noClick: true, noDrag: true, noKeyboard: true, multiple: false });

	const removeFromList = useCallback((index: number) => {
		if(!mode) return;
		if(!lists) return;

		switch(mode) {
			case WeaponMode.Standard: setLists({ ...lists, standard: lists.standard.filter((item, itemIndex) => itemIndex !== index)}); break;
			case WeaponMode.Salmon: setLists({ ...lists, salmon: lists.salmon.filter((item, itemIndex) => itemIndex !== index)}); break;
			case WeaponMode.Grizzco: setLists({ ...lists, grizzco: lists.grizzco.filter((item, itemIndex) => itemIndex !== index)}); break;
		}
	}, [mode, lists]);

	const addToList = useCallback((id: number) => {
		if(!mode) return;
		if(!lists) return;

		switch(mode) {
			case WeaponMode.Standard: setLists({ ...lists, standard: [id].concat(lists.standard)}); break;
			case WeaponMode.Salmon: setLists({ ...lists, salmon: [id].concat(lists.salmon)}); break;
			case WeaponMode.Grizzco: setLists({ ...lists, grizzco: [id].concat(lists.grizzco)}); break;
		}
	}, [mode, lists]);

	const weaponClasses = useMemo(() => {
		if(!mode) return [];

		switch(mode) {
			case WeaponMode.Standard: return standardWeapons;
			case WeaponMode.Salmon: return salmonWeapons;
			case WeaponMode.Grizzco: return grizzcoWeapons;
			default: return [];
		}

	}, [mode])

	const activeList = useMemo(() => {
		if(!mode) return [];
		if(!lists) return [];

		switch(mode) {
			case WeaponMode.Standard: return lists.standard;
			case WeaponMode.Salmon: return lists.salmon;
			case WeaponMode.Grizzco: return lists.grizzco;
			default: return [];
		}
	}, [mode, lists]);

	const exportList = useCallback(() => {
		if(!mode) return;

		const exportData: Listexport = { mode: mode, weaponIds: activeList};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "text/plain;charset=utf-8"});

		saveAs(blob, `${mode}List.json`);
	}, [mode, activeList]);

	return (
		<Wrapper>
			<Modes {...getRootProps()}>
				<Options>
					<input {...getInputProps()} />
					<CollapseContainer title="Settings">
						<OutlineButton
						$content='Reset List'
						$colorTag='reset'
						onClick={() => { resetList(); }}>Reset List</OutlineButton>
						<OutlineButton
						$content='Import List'
						$colorTag='import'
						onClick={() => { open(); }}>Import List</OutlineButton>
						<OutlineButton
						$content='Export List'
						$colorTag='export'
						onClick={() => { exportList(); }}>Export List</OutlineButton>
					</CollapseContainer>
					<CollapseContainer title="Controls">
						<SelectButton
						$content='Show Recent'
						$colorTag='control'
						$selected={display === DisplayMode.Recent}
						onClick={() => { setDisplay(DisplayMode.Recent); }}>Show Recent</SelectButton>
						<SelectButton
						$content='Show Freqs'
						$colorTag='control'
						$selected={display === DisplayMode.Frequencies}
						onClick={() => { setDisplay(DisplayMode.Frequencies); }}>Show Freqs</SelectButton>
						<SelectButton
						$content='Show Unseen'
						$colorTag='control'
						$selected={display === DisplayMode.Unseen}
						onClick={() => { setDisplay(DisplayMode.Unseen); }}>Show Unseen</SelectButton>
						<SelectButton
						$content='Show Rolls'
						$colorTag='control'
						$selected={display === DisplayMode.Rolls}
						onClick={() => { setDisplay(DisplayMode.Rolls); }}>Show Rolls</SelectButton>
					</CollapseContainer>
					<CollapseContainer title="Modes">
						<SelectButton 
						$content="Standard"
						$colorTag='standard'
						$selected={mode === WeaponMode.Standard}
						onClick={() => { setMode(WeaponMode.Standard); }}>Standard</SelectButton>
						<SelectButton 
						$content="Salmon Run"
						$colorTag='salmon'
						$selected={mode === WeaponMode.Salmon}
						onClick={() => { setMode(WeaponMode.Salmon); }}>Salmon Run</SelectButton>
						<SelectButton  
						$content="Grizzco Only"
						$colorTag='grizzco'
						$selected={mode === WeaponMode.Grizzco}
						onClick={() => { setMode(WeaponMode.Grizzco); }}>Grizzco Only</SelectButton>
					</CollapseContainer>
				</Options>
				<Recents>
					<CollapseContainer title="Recents">
						<RecentList weaponIds={activeList} onClickWeapon={removeFromList} />
					</CollapseContainer>
				</Recents>
			</Modes>
			<Weapons $size={weaponSize}>
			{importError !== "" && (<ErrorText $colorTag='reset' $content={`Import Error: ${importError}`}>{`Import Error: ${importError}`}</ErrorText>)}
			{display === DisplayMode.Rolls && (
				<RollWeapons
					weaponClasses={weaponClasses}
					numWeaponRolls={numWeaponRolls}
					setNumWeaponRolls={setNumWeaponRolls}
					randomWeapons={randomWeapons}
					setRandomWeapons={setRandomWeapons}
					onClickWeapon={addToList}
					weaponIds={activeList}
					weaponSize={weaponSize}
					 />
			)}
			{weaponClasses && weaponClasses.map((weaponClass, index) => {
				return (
					<WeaponList 
					weaponSize={weaponSize}
					key={index} 
					weaponClass={weaponClass}
					onClickWeapon={addToList}
					weaponIds={activeList} />
				)
			})}
			</Weapons>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
	display: grid;
	grid-template-columns: max-content 1fr;
`;

const Modes = styled.div`
	margin: 0 10px;
	position: relative;
	display: grid;
	width: 190px;
	grid-template-rows: max-content 1fr;
	height: 100vh;
	justify-items: center;

	//If too short, the full left column will become scrollable instead of just the recent list
	overflow: auto;

	@media screen and (min-height: 950px) {
		overflow: visible;
	}
`;

const ErrorText = styled(HeadText)`
	position: relative;
	margin-left: 5px;
	width: 100%;	
`;

const Options = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const Recents = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	height: 100%;
	min-height: 0;
	gap: 6px;
`;

const Weapons = styled.div<{ $size: number }>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: flex-start;
	align-content: flex-start;
	column-gap: ${({ $size }) => $size + 10}px;
	height: 100vh;

	overflow: auto;
`;

const root = createRoot(document.getElementById('root')!);
root.render(<WeaponTracker />);