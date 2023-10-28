import styled from "@emotion/styled";
import { ComponentProps, FC, useState } from "react";
import { Control, useController } from "react-hook-form";

import ErrorMessage from "./error-message";

interface InputProps extends ComponentProps<"input"> {
    control: Control<any>
    name: string

    onChange?: (e: any) => void
    hide?: boolean
    placeholder?: string
    defaultValue?: string | number
    rules?: any
    customError?: string
    maxLength?: number
    label?: string
    number?: boolean
}

const Input: FC<InputProps> = ({
    control,
    rules,
    defaultValue,
    onChange,
    name,
    customError,
    maxLength,
    hide,
    label,
    type,
    ...props }) => {
    const { field, fieldState } = useController({ name, rules, control, defaultValue });
    const [passwordHidden, setPasswordHidden] = useState(hide == true);
        
    return (
        <Wrapper>
            {label &&
                <InputLabel htmlFor={name}>
                    {label}
                </InputLabel>
            }
            <StyledInput
                maxLength={maxLength ? maxLength : 150}
                id={name}
                value={field.value}
                type={hide != undefined ? (passwordHidden ? "password" : "text") : type}
                onChange={(e) => {field.onChange(e.target.value); onChange && onChange(e);}}
                errored={Boolean(fieldState.error)}
                autoComplete="off"
                {...props} 
            />
            {hide && <HideIcon
                className="light-opacity"
                alt="skrýt_text"
                onClick={() => setPasswordHidden(!passwordHidden)}
                src={passwordHidden ? "/icons/hide-password-eye-closed.svg" : "/icons/hide-password-eye-open.svg"}
            />}

            <InputUnderInformation>
                {(!!fieldState.error && fieldState?.error?.message) && <ErrorMessage>{fieldState.error.message}</ErrorMessage>}
                {(!!fieldState.error && (!fieldState?.error?.message && customError)) && <ErrorMessage>{customError}</ErrorMessage>}
                
                <MaxLengthDiv>
                    {field.value.toString()?.length ?? 0} / {maxLength ? maxLength : 150}
                </MaxLengthDiv>
            </InputUnderInformation>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: relative;
    width: 100%;
`;

const HideIcon = styled("img")`
    position: absolute;
    top: 18px;
    right: 19px;
    cursor: pointer;
`;

export const InputLabel = styled("label")`
    ${p => p.theme.fontStyles.h4};
    color: ${p => p.theme.content.primary};
    margin-bottom: 10px;
    cursor: pointer;
`;

const StyledInput = styled("input") <{ errored?: boolean, hide?: boolean }>`
    padding: ${p => p.hide ? "0px 53px 0px 17px" : "0px 17px"};
    width: 100%;
    border-radius: 12px;
    height: 60px;
    background: ${p => p.theme.background.primary};
    color: ${p => p.theme.content.primary};
    border: 1px solid ${p => p.errored ? p.theme.primitives.red : p.theme.background.secondary};
    outline: none;
    ${p => p.theme.fontStyles.items};


    input::-webkit-contacts-auto-fill-button {
        position: absolute;
        right: ${p => p.hide && 44}px;
    }

    &:first-of-type::-webkit-inner-spin-button,
    &:first-of-type::-webkit-outer-spin-button{
        -webkit-appearance: none;
        margin: 0;
    }

    &::placeholder {
        color: ${p => p.theme.content.secondary};
    }

    &:focus {
        outline: none;
        border: 2px solid ${p => p.theme.primitives.green};
        padding: ${p => p.hide ? "0px 52px 0px 16px" : "0px 16px"};
    }
`;

export const MaxLengthDiv = styled("div")`
    width: 100%;
    text-align: right;
    color: ${p => p.theme.content.secondary};
    padding: 4px 0px;
`;

export const InputUnderInformation = styled("div")`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
`;

export default Input;