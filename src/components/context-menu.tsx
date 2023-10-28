
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../utils/contexts";
import { useClickOutside } from "../utils/events";
import Dropdown from "./dropdown";
import styled from "@emotion/styled";

export interface CursorPosition {
    x: number
    y: number
}

export interface ContextMenuItem {
    label: string
    action: () => void
    divider?: boolean
}

export interface ContextMenu {
    items: ContextMenuItem[]
    snapTo?: HTMLElement
    coordinates?: CursorPosition
    activeItem?: number
}


export const ContextMenuRenderer = () => {
    const {contextMenu, hideContextMenu} = useContext(GlobalContext);

    const [onMount, onCleanUp] = useClickOutside(hideContextMenu);

    const [computePosition, setComputePosition] = useState<{top: number, left: number}>();

    useEffect(() => {
        if (!contextMenu) return;
        if (!contextMenu!.snapTo && !contextMenu!.coordinates) return;
        let contextMenuHeight = 16;

        for (const item of contextMenu?.items ?? []) {
            contextMenuHeight += 40;
        }
        const contextMenuWidth = 312;
        const offset = 4;

        // ContextMenu by Element position
        if (contextMenu!.snapTo) {
            const snapTo = contextMenu!.snapTo;
            const rect = snapTo!.getBoundingClientRect();

            const contextMenuTop = rect.top + rect.height + offset;
            const flippedContextMenuTop = rect.top - offset - contextMenuHeight;
            const verticallyFlipped = (contextMenuTop + contextMenuHeight) > window.innerHeight;

            const contextMenuLeft = rect.left;
            const flippedContextMenuLeft = rect.right - contextMenuWidth;
            const horizontallyFlipped = (rect.left + contextMenuWidth) > window.innerWidth;

            setComputePosition({
                top: verticallyFlipped ? flippedContextMenuTop : contextMenuTop,
                left: horizontallyFlipped ? flippedContextMenuLeft : contextMenuLeft,
            });
            return;
        }

        // ContextMenu by cursor position
        const contextMenuTop = contextMenu!.coordinates!.y + offset;
        const flippedContextMenuTop = contextMenu!.coordinates!.y - offset - contextMenuHeight;
        const verticallyFlipped = (contextMenuTop + contextMenuHeight) > window.innerHeight;

        const contextMenuLeft = contextMenu!.coordinates!.x;
        const flippedContextMenuLeft = contextMenu!.coordinates!.x - contextMenuWidth;
        const horizontallyFlipped = (contextMenu!.coordinates!.x + contextMenuWidth) > window.innerWidth;

        setComputePosition({
            top: verticallyFlipped ? flippedContextMenuTop : contextMenuTop,
            left: horizontallyFlipped ? flippedContextMenuLeft : contextMenuLeft
        });
    }, [contextMenu]);

    function handleScroll() {
        if (!contextMenu) return;
        hideContextMenu();
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        onMount();

        return () => { 
            window.removeEventListener("scroll", handleScroll); 
            onCleanUp();
        };
    }, []);

    async function onChange(index: number) {
        await contextMenu?.items[index].action();
    }

    return (
        <Wrapper id="context-menu">
            {contextMenu && computePosition && 
                <Dropdown 
                    onChange={onChange}
                    reversedTop={0}
                    left={computePosition!.left}
                    top={computePosition!.top}
                    hideDropdown={hideContextMenu} 
                    items={contextMenu?.items.map((contextMenuItem) => ({
                        label: contextMenuItem.label,
                        borderBottom: contextMenuItem.divider,
                        onClick: contextMenuItem.action,
                    })) ?? []}
                />
            }
        </Wrapper>
    );
}

const Wrapper = styled("div")`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
`;