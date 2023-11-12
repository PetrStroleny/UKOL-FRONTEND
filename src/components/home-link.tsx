import styled from "@emotion/styled";
import { FC } from "react";
import {Link, useRoute} from "wouter";

interface HomeLinkProps {
    href: string
    label: string
    onClick?: () => void
    trailing?: JSX.Element
}

const HomeLink: FC<HomeLinkProps> = ({href, label, trailing, onClick}) => {
    const [isActive] = useRoute(href);
    
    return(
        <Wrapper onClick={onClick} href={href} className={isActive ? "isActive" : "" }>
            {label}
            {trailing}
        </Wrapper>
    );
}

const Wrapper = styled(Link)<{hrefactive: boolean}>`
    padding: 20px 40px;
    width: 100%;
    background-color: ${p => p.theme.primitives.blueHover};
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    max-width: 250px;
    border: 2px solid ${p => p.theme.background.tertiary};
    border-radius: 16px;
    
    > i {
        margin-left: 10px;
    }


    &:hover {
        opacity: 0.8;
    }

    &:active {
        opacity: 0.6;
    }
`;

export default HomeLink;