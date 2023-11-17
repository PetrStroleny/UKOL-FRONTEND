import styled from "@emotion/styled";
import { useContext, useRef } from "react";
import useSWR from "swr";
import { Link, useLocation } from "wouter";
import ErrorPage from "../pages/error-page";
import { GlobalContext, ShoppingListType, User } from "../utils/contexts";
import Button, { ButtonType } from "./button";
import LeftPanelLink from "./left-panel-link";

const LeftPanel = () => {
    const {showContextMenu, activeUserToken, setActiveUserToken, showArchived, setShowArchived} = useContext(GlobalContext);
    const { data: shoppingLists, error: shoppingListsError } = useSWR<ShoppingListType[]>("shopping-list");
    const { data: users, error: usersError } = useSWR<User[]>("user");

    const [_, setLocation] = useLocation();

    const userRef = useRef(null);   

    if (shoppingListsError || usersError) return <ErrorPage/>;

    if (!shoppingLists || !users) return <>Načítání...</>;

    return (
        <Wrapper>
            <div>
                <div>
                    <Link href="/">
                        <Button buttonType={ButtonType.SECONDARY}>
                            <p>
                                <i className="fa fa-cart-shopping" />
                                Domů
                            </p>
                        </Button>
                    </Link>
                    <Button 
                        onClick={() => setShowArchived(!showArchived)} buttonType={showArchived ? ButtonType.SECONDARY : ButtonType.PRIMARY} 
                    >
                        {showArchived ? "Skrýt archivované" : "Zobrazit archivované"}
                    </Button>
                </div>
                <div>
                    {shoppingLists.filter((shoppingList) => showArchived ? true : !shoppingList.archived).sort((a, b) => {
                                    if(a.archived == b.archived) return 0;
                                    if (a.archived) return 1;
                                    return -1;
                                }).map((shoppingList, i) =>
                        <LeftPanelLink 
                            key={i}
                            href={`/${shoppingList.slug}`}
                            label={shoppingList.name}
                            leading={shoppingList.archived ? <i className="fa fa-box-archive" /> : undefined}
                        />
                    )}
                </div>
            </div>

            <UserDiv className="hover-active" onClick={() =>
                showContextMenu(
                    users.map(user => ({
                        label: user.name, 
                        action: () => {
                            setActiveUserToken(user.token); 
                            setLocation("/");
                    }})), 
                    userRef.current,
                )
            }>
                <p ref={userRef}>
                    {users.filter(user => user.token == activeUserToken)[0].name}
                </p>
            </UserDiv>
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
    overflow-y: auto;

    > div:first-of-type {
        display: flex;
        flex-direction: column;
        gap: 10px;

        > div:first-of-type {
            display: flex;
            justify-content: space-between;
            padding: 0px 10px;

            > button > p > i {
                margin-right: 5px;
            }
        }

        > div:last-of-type {
            align-items: flex-start;
            display: flex;
            gap: 10px;
            flex-direction: column;
        }
    }
    width: 300px;
    max-height: 100vh;
    min-height: 100vh;
    box-shadow: 0px 0.8px 0.9px ${p => p.theme.background.secondary},0px 1.6px 3.6px ${p => p.theme.background.secondary};
`;

const UserDiv = styled("div")`
    display: flex;
    align-items: center; 
    cursor: pointer;
    width: calc(100% - 16px);
    border-radius: 8px;
    margin: 8px 8px 0px 8px;
    background-color: ${p => p.theme.background.secondary};

    > p {
        padding: 20px 0px;
        padding-left: 18px;
        margin-left: 18px;
    }
`;

export default LeftPanel;