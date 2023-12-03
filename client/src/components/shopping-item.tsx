import styled from "@emotion/styled";
import { FC } from "react";
import CheckBox from "./checkbox";
import Button, { ButtonShape } from "./button";
import { ShoppingItemType } from "../pages/shopping-list";

interface ShoppingItemProps extends ShoppingItemType {
    children: string
    onDoneToogle: () => void
    onDelete: () => void
}

const ShoppingItem: FC<ShoppingItemProps> = ({children, count, done, onDoneToogle, onDelete}) => (
    <Wrapper className={done ? "done primary-background" : "primary-background" }>
        <p>
            {count}
        </p>    
        <p>
            {children}
        </p>    

        <div>
            <CheckBox
                checked={done}
                onClick={onDoneToogle}
            />

            <Button shape={ButtonShape.CIRCLE} onClick={onDelete}>
                <i className="fa fa-xmark" />
            </Button>
        </div>
    </Wrapper>
);

const Wrapper = styled("div")`
    padding: 20px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    border: 2px solid ${p => p.theme.inverse.content.primary};
    margin: -2px;
    &.done {
        border-color: ${p => p.theme.primitives.green};
    }

    > p {
        font: ${p => p.theme.fontStyles.b2};   
    }

    > div:first-of-type {
        display: flex;
        align-items: center;
        gap: 10px;
    }

`;

export default ShoppingItem;