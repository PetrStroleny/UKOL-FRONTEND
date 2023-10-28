import styled from "@emotion/styled";
import { forwardRef, ComponentProps } from "react";


export enum ButtonType {
    PRIMARY = "primary-type",
    SECONDARY = "secondary-type",
    TERTIARY = "tertiary-type",
}

export enum ButtonShape {
    RECTANGLE = "rectangle",
    CIRCLE = "circle",
}

interface ButtonProps extends ComponentProps<"button"> {
    children: JSX.Element | string
    buttonType?: ButtonType
    shape?: ButtonShape
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({children, onClick, buttonType, shape, ...props}, ref) => (
    <Wrapper onClick={onClick} ref={ref} className={`${buttonType ?? "secondary-type"} ${shape ?? "rectangle"}`} {...props}>
        {children}
    </Wrapper>
    )
);

const Wrapper = styled("button")`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    background-color: transparent;
    width: fit-content;
    font: ${p => p.theme.fontStyles.b2};

    &.${ButtonShape.RECTANGLE} {
        padding: 10px;
        border-radius: 12px;
    }

    &.${ButtonShape.CIRCLE} {
        padding: 9px;
        border-radius: 999px;
        width: 30px;
        height: 30px;
    }

    &.${ButtonType.PRIMARY} {
        background-color: ${p => p.theme.primitives.green};
        color: ${p => p.theme.inverse.content.primary};
        
        &:hover {
            opacity: 0.8;
        }

        &:active {
            opacity: 0.6;
        }
    }

    &.${ButtonType.SECONDARY} {
        background-color: transparent;
        color: ${p => p.theme.content.primary};

        &:hover {
            background-color: ${p => p.theme.content.tertiary};
            opacity: 0.8;
        }

        &:active {
            background-color: ${p => p.theme.content.secondary};
            opacity: 0.8;
        }
    }

    &.${ButtonType.TERTIARY} {
        background-color: ${p => p.theme.primitives.error};
        color: ${p => p.theme.inverse.content.primary};
        
        &:hover {
            opacity: 0.8;
        }

        &:active {
            opacity: 0.6;
        }
    }
`;

export default Button;