import styled from "@emotion/styled";
import { Theme } from "../style-variables";

const ProgressSpinner = () => (
    <Wrapper>
        <Spinner>
            <svg viewBox="22 22 44 44">
                <circle
                    style={{ stroke: Theme.background.secondary }}
                    cx="44"
                    cy="44"
                    r="20.2"
                    fill="none"
                    strokeWidth="3.6"
                    shapeRendering="geometricPrecision"
                />
                <circle
                    style={{ stroke: Theme.primitives.green }}
                    cx="44"
                    cy="44"
                    r="20.2"
                    fill="none"
                    strokeWidth="3.6"
                    shapeRendering="geometricPrecision"
                />
            </svg>
        </Spinner>
    </Wrapper>
);

const Wrapper = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
`;


const Spinner = styled("div")`
    height: 36px;
    width: 36px;

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
    animation: spin 1.4s linear infinite;

    @keyframes dash {
        0% {
            stroke-dasharray: 1px 200px;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 100px 200px;
            stroke-dashoffset: -15px;
        }
        100% {
            stroke-dasharray: 100px 200px;
            stroke-dashoffset: -125px;
        }
    }

    > svg > circle {
        &:first-of-type {
            transform-origin: center;
        }

        &:last-of-type {
            stroke-dasharray: 80px, 200px;
            stroke-dashoffset: 0;
            transform-origin: center;
            animation: dash 1.4s ease-in-out infinite;
        }
    }
`;

export default ProgressSpinner;