import {createContext} from "react";
import {ContextMenu, ContextMenuItem, CursorPosition } from "../components/context-menu";

export interface User {
    id: number
    name: string
    token: string
}


export interface ShoppingListType {
    id: number
    href: string
    slug: string
    name: string
    archived: boolean
    members: number[]
    owner: number
}

export const GlobalContext = createContext<{
    activeUserToken: string,
    setActiveUserToken: (token: string) => void,
    contextMenu: ContextMenu | null,
    setContextMenu: (value: ContextMenu | null) => void,
    showContextMenu: (items: ContextMenuItem[], snapTo?: HTMLElement, coordinates?: CursorPosition, activeItem?: number) => void,
    hideContextMenu: () => void,
    showArchived: boolean,
    setShowArchived: (value: boolean) => void,
  }>({
    activeUserToken: "",
    setActiveUserToken: () => {},
    contextMenu: null,
    setContextMenu: () => {},
    hideContextMenu: () => {},
    showContextMenu: () => {},
    showArchived: false,
    setShowArchived: () => {},
});