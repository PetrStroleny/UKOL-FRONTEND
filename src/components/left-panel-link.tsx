import styled from "@emotion/styled";
import { FC } from "react";
import {Link, useRoute} from "wouter";

interface LeftPanelLinkProps {
    href: string
    label: string
}

const LeftPanelLink: FC<LeftPanelLinkProps> = ({href, label}) => {
    const [isActive] = useRoute(href);
    
    return(
        <Wrapper href={href} className={isActive ? "isActive" : "" }>
            {label}
        </Wrapper>
    );
}

const Wrapper = styled(Link)<{hrefactive: boolean}>`
    padding: 20px 40px;
    width: calc(100% - 16px);
    border-radius: 8px;
    margin: 0px 8px;
    background-color: ${p => p.theme.background.secondary};

    &.isActive {
        background-color: ${p => p.theme.primitives.greenHover};
    }

    &:hover {
        opacity: 0.8;
    }

    &:active {
        opacity: 0.6;
    }
`;

export default LeftPanelLink;