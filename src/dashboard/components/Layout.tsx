import { styled, css } from 'styled-components' 

export const HeadText = styled.h1<{ $colorTag?: string, $content?: string }>`
	position: relative;
	margin: 6px 0;
	font-size: 1.5rem;
	color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `text` });
	isolation: isolate;

	&::before {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		content: "${({ $content }) => $content}";
		-webkit-text-stroke: 10px var(--text-outline);
		z-index: -1;
	}
`;

export const Button = styled.button<{ $colorTag?: string }>`
	margin: 5px 0;
	padding: 10px 5px;
	font-size: 1.5rem;
	width: 100%;
	font-weight: bold;
	color: var(--text);
	background-color: var(--regular-button);
	border: 2px solid var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button` });
	border-radius: 4px;

	&:not(:disabled):hover {
		background-color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button`});
	}

	&:not(:disabled):active {
		background-color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button`}-dark);
	}
`;

export const OutlineButton = styled(Button)<{ $content: string }>`
	padding: 15px 10px;
	isolation: isolate;

	&::before {
		position: absolute;
		width: 100%;
		left: 0;
		content: "${({ $content }) => $content}";
		left: 0;
		color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button`}-dark);
		-webkit-text-stroke: 8px var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button`}-dark);
		z-index: -1;
	}
`;

export const SelectButton = styled(OutlineButton)<{ $selected: boolean }>`
	${({ $selected, $colorTag }) => $selected ? css`
	background-color: var(${$colorTag ? `--${$colorTag}` : `--button` });
	` : css``}
`;