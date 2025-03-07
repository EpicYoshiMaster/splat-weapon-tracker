import React, { useState } from 'react';
import styled from 'styled-components';
import { HeadTextButton } from './Layout';

interface CollapseContainerProps {
    title: string;
	children: React.ReactNode;
}

export const CollapseContainer: React.FC<CollapseContainerProps> = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Container>
            <HeadRow>
                <HeadTextButton 
                    onClick={() => { setCollapsed(!collapsed); }}
                    $content={title}>{title}</HeadTextButton>
            </HeadRow>
            {!collapsed && (
            <Container>
                {children}
            </Container>
            )}            
        </Container>
    )
};

const Container = styled.div`
    display: contents;
`;

const HeadRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
`;