/**
 * Horizontally squishes text within a max width
 * 
 * A React version of:
 * fitted-text -  https://github.com/inkfarer/fitted-text
 * sc-fitted-text - https://github.com/SupportClass/sc-fitted-text
 * 
 */
import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import FontFaceObserver from 'fontfaceobserver'
import styled, { css } from 'styled-components';
import useResizeObserver from '@react-hook/resize-observer'

type FittedTextAlign = 'left' | 'center' | 'right';

interface FittedTextProps
{
	text: string;
	maxWidth: number;
	align: FittedTextAlign;
	font: string;
	outline?: {
		width: number;
		colorTag: string;
	}
}

const justifyAlign = (align: FittedTextAlign) => {
	switch(align) {
		case 'center': return 'center';
		case 'right': return 'flex-end';
		case 'left': return 'unset';
	}
}

const useScrollWidth = (target: HTMLElement | null) => {
	const [scrollWidth, setScrollWidth] = useState<number>(0);

	useLayoutEffect(() => {
		target && setScrollWidth(target.scrollWidth);
	}, [target]);


	useResizeObserver(target, (entry) => target && setScrollWidth(target.scrollWidth));
	return scrollWidth;
}

export const FittedText: React.FC<FittedTextProps> = ({ text, maxWidth, align, font, outline }) => {
	const [target, setTarget] = useState<HTMLElement | null>(null);
	const [textScale, setTextScale] = useState(0);
	const scrollWidth = useScrollWidth(target);

	useEffect(() => {
		new FontFaceObserver(font).load().then(() => {
			
			if(scrollWidth > maxWidth) {
				setTextScale(maxWidth / scrollWidth);
			}
			else {
				setTextScale(1);
			}
		}).catch(() => {
			setTextScale(1);
		})
	}, [text, maxWidth, align, font, setTextScale, scrollWidth]);

	return (
		<TextSpace 
		$maxWidth={maxWidth}
		$align={align}
		>
			<TextFit
			ref={setTarget} 
			$scale={textScale}
			$font={font}
			$align={align}
			$content={text}
			$outline={outline}
			>
			{text}	
			</TextFit>
		</TextSpace>
	)
}

const TextSpace = styled.div<{ $maxWidth: number, $align: FittedTextAlign }>`
	position: relative;
	display: flex;

	justify-content: ${({$align}) => justifyAlign($align)};
	
	white-space: nowrap;
	max-width: ${({$maxWidth}) => $maxWidth > 0 ? `${$maxWidth}px` : `unset`};
`;

const TextFit = styled.div<{ 
	$scale: number, 
	$font: string, 
	$align: FittedTextAlign, 
	$content: string
	$outline?: { width: number, colorTag: string } }>`

	text-align: ${({$align}) => $align};
	transform-origin: ${({$align}) => `${$align} center`};
	width: max-content;
	transform: scaleX(${({ $scale }) => $scale});
	font-family: ${({ $font}) => $font};

	${({ $outline, $content }) => $outline ? css`
		&::before {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			content: "${$content}";
			-webkit-text-stroke: ${$outline.width}px var(--${$outline.colorTag});
			z-index: -1;
		}
	` : css``}

	
`;