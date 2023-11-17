import styled from "@emotion/styled";
import { FC } from "react";


interface EmptyStateProps {
   label: string
   description: string 
}

const EmptyState: FC<EmptyStateProps> = ({label, description}) => (
    <Wrapper>
        <h4>
            {label}
        </h4>
        <p>
            {description}
        </p>
    </Wrapper>
);

const Wrapper = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    color: ${p => p.theme.content.primary};

    > h4 {
        font: ${p => p.theme.fontStyles.b1};
    }

    > p {
        font: ${p => p.theme.fontStyles.b2};
    }
`;

export default EmptyState;