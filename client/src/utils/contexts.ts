import {createContext} from "react";
import {ContextMenu, ContextMenuItem, CursorPosition } from "../components/context-menu";

export interface User {
    _id: number
    name: string
    token: string
}

export enum Languague {
    CZE = "CZE",
    ENG = "ENG",
} 

export function getLabelFromLanguage(lan: Languague, activeLan: Languague): string {
    switch (lan) {
        case Languague.CZE: return getTextAfterLanguage("Čeština", "Czech", activeLan);
        case Languague.ENG: return getTextAfterLanguage("Angličtina", "English", activeLan);
    } 
} 

export function getTextAfterLanguage(cze: string, eng: string, activeLan: Languague): string {
    switch (activeLan) {
        case Languague.CZE: return cze;
        case Languague.ENG: return eng;
    }
} 

export interface ShoppingListType {
    _id: number
    href: string
    slug: string
    name: string
    archived: boolean
    members: number[]
    owner: number
}

export const GlobalContext = createContext<{
    activeLanguage: Languague,
    setActiveLanguage: (lan: Languague) => void,
    activeUserToken: string,
    setActiveUserToken: (token: string) => void,
    contextMenu: ContextMenu | null,
    setContextMenu: (value: ContextMenu | null) => void,
    showContextMenu: (items: ContextMenuItem[], snapTo?: HTMLElement, coordinates?: CursorPosition, activeItem?: number) => void,
    hideContextMenu: () => void,
    showArchived: boolean,
    setShowArchived: (value: boolean) => void,
  }>({
    activeLanguage: Languague.CZE,
    setActiveLanguage: (lan: Languague) => {},
    activeUserToken: "",
    setActiveUserToken: () => {},
    contextMenu: null,
    setContextMenu: () => {},
    hideContextMenu: () => {},
    showContextMenu: () => {},
    showArchived: false,
    setShowArchived: () => {},
});