import {createContext} from "react";
import {ContextMenu, ContextMenuItem, CursorPosition } from "../components/context-menu";

export enum UserType {
    USER,
    OWNER,
}

export function userTypeToLabel(type: UserType) {
    switch(type) {
        case UserType.OWNER: return "Vlastník";
        case UserType.USER: return "Člen";
    }
}

export interface ShoppingListType {
    href: string
    label: string
    archived: boolean
}

export const GlobalContext = createContext<{
    shoppingLists: ShoppingListType[],
    setShoppingLists: (shoppingLists: ShoppingListType[]) => void,
    activeUser: UserType,
    setActiveUser: (type: UserType) => void,
    contextMenu: ContextMenu | null,
    setContextMenu: (value: ContextMenu | null) => void,
    showContextMenu: (items: ContextMenuItem[], snapTo?: HTMLElement, coordinates?: CursorPosition, activeItem?: number) => void,
    hideContextMenu: () => void,
    showArchived: boolean,
    setShowArchived: (value: boolean) => void,
  }>({
    shoppingLists: [],
    setShoppingLists: () => {},
    activeUser: UserType.USER,
    setActiveUser: () => {},
    contextMenu: null,
    setContextMenu: () => {},
    hideContextMenu: () => {},
    showContextMenu: () => {},
    showArchived: false,
    setShowArchived: () => {},
});