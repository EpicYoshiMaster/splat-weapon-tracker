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

export const HeadTextButton = styled.button<{ $colorTag?: string, $content?: string }>`
	position: relative;
	margin: 6px 0;
	font-size: 1.5rem;
	font-weight: bold;
	color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `text` });
	isolation: isolate;
	border: none;
	background-color: transparent;

	&::before {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		content: "${({ $content }) => $content}";
		-webkit-text-stroke: 10px var(--text-outline);
		z-index: -1;
	}

	&:hover {
        cursor: pointer;
		color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `text` }-highlight);
    }
`;

export const Button = styled.button<{ $colorTag?: string }>`
	position: relative;
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

	&:disabled {
		border: 2px solid var(--base);
	}

	&:disabled:hover {
		background-color: var(--base-dark);
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
		color: var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button`}-dark);
		-webkit-text-stroke: 8px var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button`}-dark);
		z-index: -1;

		&:disabled {
			color: var(--base-dark);
			-webkit-text-stroke: 8px var(--base-dark);
		}
	}

	&:disabled {
		&::before {
			color: var(--base-dark);
			-webkit-text-stroke: 8px var(--base-dark);
		}
	}
`;

export const Input = styled.input<{ $colorTag?: string }>`
	padding: 10px 5px;
	width: 60px;
	font-size: 1.75rem;
	font-weight: bold;
	color: var(--text);

	background-color: var(--regular-button);
	border: 2px solid var(--${({ $colorTag }) => $colorTag ? `${$colorTag}` : `button` });
	border-radius: 4px;
`;

export const SelectButton = styled(OutlineButton)<{ $selected: boolean }>`
	${({ $selected, $colorTag }) => $selected ? css`
	background-color: var(${$colorTag ? `--${$colorTag}` : `--button` });
	` : css``}
`;

export const SettingsButton = styled(SelectButton)`
	padding: 15px 5px;
	font-size: 1.5rem;
	max-width: 165px;
`;