import styled from "@emotion/styled";
import {useContext, useRef} from "react";
import {GlobalContext, UserType, userTypeToLabel} from "../utils/contexts";
import LeftPanelLink from "./left-panel-link";

const LeftPanel = () => {

    const {showContextMenu, activeUser, setActiveUser, shoppingLists} = useContext(GlobalContext);

    const userRef = useRef(null);

    return (
        <Wrapper>
            <div>
                {shoppingLists.map((shoppingList, i) =>
                    <LeftPanelLink 
                        key={i}
                        href={`/${shoppingList.href}`}
                        label={shoppingList.label}
                    />
                )}
            </div>
            <User className="hover-active" onClick={() =>
                showContextMenu(
                    [
                        {label: userTypeToLabel(UserType.OWNER), action: () => setActiveUser(UserType.OWNER)},
                        {label: userTypeToLabel(UserType.USER), action: () => setActiveUser(UserType.USER)},
                    ], userRef.current
                )
            }>
                <p ref={userRef}>
                    {userTypeToLabel(activeUser)}
                </p>
            </User>
        </Wrapper>
    );
}
const Wrapper = styled("header")`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    padding: 8px 0px;
    background-color: ${p => p.theme.background.tertiary};

    > div:first-of-type {
        align-items: flex-start;
        display: flex;
        gap: 10px;
        flex-direction: column;
    }

    width: 300px;
    max-height: 100vh;
    min-height: 100vh;
    box-shadow: 0px 0.8px 0.9px ${p => p.theme.background.secondary},0px 1.6px 3.6px ${p => p.theme.background.secondary};
`;

const User = styled("div")`
    display: flex;
    align-items: center; 
    cursor: pointer;
    width: calc(100% - 16px);
    border-radius: 8px;
    margin: 0px 8px;
    background-color: ${p => p.theme.background.secondary};

    > p {
        padding: 20px 0px;
        padding-left: 18px;
        margin-left: 18px;
    }
`;

export default LeftPanel;