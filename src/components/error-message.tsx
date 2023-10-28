import styled from "@emotion/styled";

const ErrorMessage = styled("p")`
    width: 100%;
    color: ${p => p.theme.primitives.error};
    margin-top: 7px;
    margin-left: 17px;
    ${p => p.theme.fontStyles.items};
`;

export default ErrorMessage;