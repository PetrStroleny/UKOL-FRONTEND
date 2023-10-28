import {useState} from "react";


export type EventsElement = HTMLElement | Document | Window;

export function useKeyboardControl(
    keyDownListeners: {
        onSpace?: (e: KeyboardEvent) => void,
        onDown?: (e: KeyboardEvent) => void,
        onUp?: (e: KeyboardEvent) => void,
        onTab?: (e: KeyboardEvent) => void,
        onSelect?: (e: KeyboardEvent) => void,
        onCancel?: (e: KeyboardEvent) => void,
        onCharacter?: (e: KeyboardEvent) => void,
        onDelete?: (e: KeyboardEvent) => void,
    },
    disabled?: boolean,
    preventDefault?: boolean,
    keyUpListeners?: {
        onSpace?: (e: KeyboardEvent) => void,
    }
) {
    function onKeyUp(e: any) {
        switch (e.code) {
            case "Space":
                keyUpListeners?.onSpace && keyUpListeners.onSpace(e);
                break;
        }
    }

    function onKeyDown(e: any) {
        if (disabled == true || !e || !e.code) return;
        if (e.code == "Tab") {
            keyDownListeners.onTab && keyDownListeners.onTab(e);
            return;
        } else {
            preventDefault && e.preventDefault();
        }

        if (e.code.includes("Key")) {
            keyDownListeners.onCharacter && keyDownListeners.onCharacter(e);
            return;
        }

        switch (e.code) {
            case "Tab":
                keyDownListeners.onTab && keyDownListeners.onTab(e);
                break;
            case "ArrowDown":
                keyDownListeners.onDown && keyDownListeners.onDown(e);
                break;
            case "ArrowUp":
                keyDownListeners.onUp && keyDownListeners.onUp(e);
                break;
            case "Enter":
                keyDownListeners.onSelect && keyDownListeners.onSelect(e);
                break;
            case "Escape":
                keyDownListeners.onCancel && keyDownListeners.onCancel(e);
                break;
            case "Backspace":
                keyDownListeners.onDelete && keyDownListeners.onDelete(e);
                break;
            case "Space":
                keyDownListeners.onSpace && keyDownListeners.onSpace(e);
                break;
        }
    }

    return [(element: EventsElement) => {
        element.addEventListener("keydown", onKeyDown)
        element.addEventListener("keyup", onKeyUp)
    }, (element: EventsElement) => {
        element.removeEventListener("keydown", onKeyDown);
        element.removeEventListener("keyup", onKeyUp);
    }];
}

export function useClickOutside(hideElement: (e: any) => void, withOnCancel = true, divID = "context-menu"): [() => void, () => void] {
    let keyboardControlRef = useKeyboardControl({
        onCancel: () => hideElement(null),
    });

    function targetContainsElement(target: any, element: any): boolean {
        return target == element || element!.contains(target as HTMLElement);
    }

    function handleWindowClick(e: any) {
        const element = document.getElementById(divID);
        
        if (!element || targetContainsElement(e.target, element)) {
            return;
        }

        hideElement(e);
    }

    return [() => {
        window.addEventListener("click", handleWindowClick);
        withOnCancel && keyboardControlRef[0](window); 

    }, () => {
        withOnCancel && keyboardControlRef[1](window); 
        window.removeEventListener("click", handleWindowClick);
    }];
}