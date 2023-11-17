import "@emotion/react"
import { Theme } from "./src/style-variables";

type CustomTheme = typeof Theme;

declare module "@emotion/react" {
    export interface Theme extends CustomTheme { }
}