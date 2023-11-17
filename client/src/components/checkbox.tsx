import styled from "@emotion/styled";
import { FC } from "react";


interface CheckBoxProps {
    checked: boolean
    onClick: () => void
    label?: string
}

const CheckBox: FC<CheckBoxProps> = ({checked, onClick, label}) => (
    <Wrapper className="hover-active" onClick={onClick}>
        <Content className={checked ? "checked" : ""}>
            {checked && 
                <i className="fa fa-check" />
            }
        </Content>
        {label && 
            <Label>
                {label}
            </Label>
        }
    </Wrapper>
);

const Wrapper = styled("div")`
   cursor: pointer;
   display: flex;
   gap: 12px;
   width: fit-content;
   padding: 8px;
   border-radius: 999px;
`;

const Label = styled("p")`

`;

const Content = styled("div")`
    cursor: pointer;
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 2px solid ${p => p.theme.content.tertiary};

    &:hover {
        border-color: ${p => p.theme.content.seconday};
    }

    &:active {
        border-color: ${p => p.theme.content.primary};
    }

    > i {
        color: ${p => p.theme.primitives.green};
        font-size: 15px;
    }

    &.checked {
        background-color: ${p => p.theme.primitives.green};
        border-color: transparent;

        > i {
            color: ${p => p.theme.inverse.content.primary}
        }
    }
`;

export default CheckBox;