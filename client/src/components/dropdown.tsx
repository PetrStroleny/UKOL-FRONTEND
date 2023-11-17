import styled from "@emotion/styled";
import {css} from "@emotion/react";
import {FC, useEffect, useState, forwardRef} from "react";
import { useKeyboardControl } from "../utils/events";

interface DropdownItemWithClick extends DropdownItemProps {
    onClick: () => void
}

export interface DropdownProps {
    onChange: (activeIndex: number) => void
    hideDropdown: () => void
    top?: number
    left?: number
    reversedTop?: number
    items: DropdownItemProps[]
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({onChange, hideDropdown, top, left, reversedTop, items}, dropdownRef) => {
    let wrapperRef: HTMLDivElement | null = null
    const [reversed, setReversed] = useState(false);
    const [dropdownIndex, setDropdownIndex] = useState(-1);
    const [dropdownItemsWithOnClick, setDropdownItemsWithOnClick] = useState<DropdownItemWithClick[]>([]);

    useEffect(() => {
        onMount(window);
        getElementPagePosition();

        let itemsWithClick: DropdownItemWithClick[]= [];
        for (let i = 0; i < items.length; i++) {

            itemsWithClick.push({
                ...items[i],
                onClick: () => {
                    onChange(i);
                    hideDropdown();
                }
            });
        }
        setDropdownItemsWithOnClick(itemsWithClick);

        return () => onCleanup(window);
    }, []);

    function scrollToActiveElemenet(index: number) {
        wrapperRef?.children[index].scrollIntoView({ block: "nearest", inline: "start" });
    }

    const [onMount, onCleanup] = useKeyboardControl({
        onTab: (e) => {
            e.preventDefault();
        },
        onDown: (e) => {
            e.preventDefault();
            if (dropdownIndex == (items.length - 1)) {
                scrollToActiveElemenet(0);
                setDropdownIndex(0);
            } else {
                setDropdownIndex(p => { scrollToActiveElemenet(p + 1); return p + 1 });
            }
        },
        onUp: (e) => {
            e.preventDefault();
            if (dropdownIndex == 0 || dropdownIndex == -1) {
                scrollToActiveElemenet(items.length - 1);
                setDropdownIndex(items.length - 1);
            } else {
                setDropdownIndex(p => { scrollToActiveElemenet(p - 1); return p - 1 });
            }
        },
        onSelect: (e) => {
            e.preventDefault();
            if (dropdownIndex != -1) {
                dropdownItemsWithOnClick[dropdownIndex].onClick();
                hideDropdown();
            }
        },
        onCancel: () => hideDropdown(),
    });

    function getElementPagePosition() {
        if (!reversedTop) return;
        const heightFromBottom = (window.innerHeight - wrapperRef!.getBoundingClientRect().bottom);
        // Reversed is set to true if bottom is overflowing and there is more space from the top of parent element
        if (heightFromBottom < 0 && (wrapperRef!.getBoundingClientRect().top > window.innerHeight - wrapperRef!.getBoundingClientRect().top + (reversedTop ? reversedTop : 0))) {
            setReversed(true);
        } else {
            reversed && setReversed(false);
        }
    }

    return (
        <Wrapper
            reversed={reversed}
            ref={dropdownRef}
            style={{
                top: top + "px",
                left: left != undefined ? left + "px" : "",
                "--reversed-top": -(reversedTop ?? 0) + "px",
            }}
        >   
            {dropdownItemsWithOnClick.map((dropdownItem, i) => 
                <DropdownItem
                    key={i}
                    {...dropdownItem}
                />   
            )}
        </Wrapper>
    );
}
);

const Wrapper = styled("div")<{reversed: boolean}>`
    width: fit-content;
    background-color: ${p => p.theme.background.primary};
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    z-index: 2;
    position: absolute;
    display: flex;
    flex-direction: column;

    ${p => p.reversed && css`
        transform: translateY(-100%) translateY(var(--reversed-top, 0px));
    `}
    
    max-height: 304px;
    &.search-active {
        max-height: 312px;
    }

    //related to contextMenuWidth!!
    width: 260px;
    &.long {
        width: 320px;
    }
    
    //related to contextMenuHeight!!
    padding: 8px 0px;
`;

export default Dropdown;

export interface DropdownItemProps {
    leading?: JSX.Element
    trailing?: JSX.Element
    label: string
    borderBottom?: boolean
    onClick?: () => void
};

export const DropdownItem: FC<DropdownItemProps> = ({borderBottom, leading, trailing, label, onClick}) => (
    <DropdownItemWrapper   
        className="hover-active"
        borderBottom={borderBottom}
        onMouseDown={e => e.preventDefault()}
        onClick={onClick}
    >   

        {leading && leading}

        <p>{label}</p>

        {trailing && trailing}
    </DropdownItemWrapper>
);

const DropdownItemWrapper = styled("div")<{borderBottom?: boolean}>`
    display: flex;
    user-select: none;
    cursor: pointer;
    align-items: center;
    position: relative;
    background-color: ${p => p.theme.background.primary};
    width: 100%;
    padding: 0px 20px;

    //related to contextMenuHeight!!
    height: 36px;

    &:hover {
        background-color: ${p => p.theme.background.secondary};
    }

    ${p => p.borderBottom && css`
        margin-bottom: 16px;

        &:after {
            content: "";
            height: 1px;
            width: 100%;
            background-color: ${p.theme.content.secodnary};
            bottom: -8px;
            left: 0;
            position: absolute;
        }
    `}

    
    > * {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: ${p => p.theme.content.primary};

        &:not(:first-of-type) {
            margin-left: 20px;
        }

        > div, p {
            font: ${p => p.theme.fontStyles.b2};
        }
    }

    > div:last-child {
        margin-left: auto;
    }
`;