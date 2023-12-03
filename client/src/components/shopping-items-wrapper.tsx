import styled from "@emotion/styled";
import { FC } from "react";

interface ShoppingItemsWrapperProps {
    children: JSX.Element[]
}

const ShoppingItemsWrapper: FC<ShoppingItemsWrapperProps> = ({children}) => (
    <Wrapper>
        {children}
    </Wrapper>
);

const Wrapper = styled("div")`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    
    @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
        gap: 13px;
        grid-template-columns: 1fr;
    }
    
    grid-auto-rows: auto;
`;

export default ShoppingItemsWrapper;