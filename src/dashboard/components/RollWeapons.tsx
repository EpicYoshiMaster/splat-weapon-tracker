import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { OutlineButton, Input, HeadText } from './Layout';
import { getRandomWeapon, getWeaponById, getWeaponCount } from '../../utils/WeaponDatabase';
import { MAX_RANDOM_WEAPONS } from '../../utils/utils';
import { WeaponClass, WeaponMode } from '../../types/types';
import { WeaponButton } from './WeaponButton';

interface RollWeaponsProps {
	weaponClasses: WeaponClass[];
	numWeaponRolls: number;
	setNumWeaponRolls: (newValue: number | ((oldValue?: number | undefined) => void)) => void;
	randomWeapons: number[];
	setRandomWeapons: (newValue: number[] | ((oldValue?: number[] | undefined) => void)) => void;
	weaponIds: number[];
	weaponSize: number;
	onClickWeapon: (id: number) => void;
	mode: WeaponMode;
}

export const RollWeapons: React.FC<RollWeaponsProps> = ({ weaponClasses, numWeaponRolls, setNumWeaponRolls, randomWeapons, setRandomWeapons, weaponIds, weaponSize, onClickWeapon, mode }) => {

	const [isRolling, setIsRolling] = useState<boolean>(false);

	const rollWeaponsOnce = useCallback(() => {
		setRandomWeapons(Array(MAX_RANDOM_WEAPONS).fill(0).map(() => {
			return getRandomWeapon(weaponClasses).id;
		}))
	}, [weaponClasses, setRandomWeapons]);

	//Roll once to prevent selecting weapons from different weapon modes
	useEffect(() => {
		rollWeaponsOnce();
	}, [mode]);

	const rollWeapons = useCallback(() => {
		if(isRolling) return;

		const interval = window.setInterval(rollWeaponsOnce, 100);
		setIsRolling(true);

		window.setTimeout(() => { 
			window.clearInterval(interval);
			setIsRolling(false);
		}, 1000);


	}, [rollWeaponsOnce, isRolling]);

	return (
	<Wrapper>
		<HeadWrapper>
			<HeadText $colorTag='import' $content="Weapon Rolls">Weapon Rolls</HeadText>
		</HeadWrapper>
		<RollDiv>
			<RollsButton
				$content="Roll Weapons"
				$colorTag='import'
				disabled={isRolling}
				onClick={() => { rollWeapons(); }}>Roll Weapons</RollsButton>
			<Input $colorTag='import' type="number" min="1" max="8" value={numWeaponRolls} onChange={(event) => setNumWeaponRolls(Number(event.target.value))} />
			<Rolls>
			{randomWeapons.slice(0, numWeaponRolls).map((id, index) => {
				return (
					<WeaponButton 
					key={index}
					weapon={getWeaponById(id)} 
					size={weaponSize}
					onClick={onClickWeapon}
					numberDisplay={getWeaponCount(id, weaponIds)}
					marginRight={true}
					marginBottom={false}
					/>
				)
			})}
			</Rolls>
		</RollDiv>
	</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;	
	margin-bottom: 10px;
	width: 100%;
`;

const HeadWrapper = styled.div`
	position: relative;
	padding-left: 5px;	
`;

const RollsButton = styled(OutlineButton)`
	width: unset;
	margin: 0;
`;

const RollDiv = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	column-gap: 10px;
`;

const Rolls = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;	
`;

