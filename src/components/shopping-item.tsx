import styled from "@emotion/styled";
import { FC } from "react";
import CheckBox from "./checkbox";
import Button, { ButtonShape } from "./button";

interface ShoppingItemProps {
    children: string
    done: boolean
    onDoneToogle: () => void
    onDelete: () => void
}

const ShoppingItem: FC<ShoppingItemProps> = ({children, done, onDoneToogle, onDelete}) => (
    <Wrapper className={done ? "done" : "" }>
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
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${p => p.theme.background.primary};

    &.done {
        border: 2px solid ${p => p.theme.primitives.green};
        margin: -2px;
    }

    > div:first-of-type {
        display: flex;
        align-items: center;
        gap: 10px;
    }

`;

export default ShoppingItem;