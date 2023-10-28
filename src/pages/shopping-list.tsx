import { useEffect, useState, useContext, useRef } from "react";
import { Helmet } from "react-helmet";
import { useParams, useLocation } from "wouter";
import ShoppingItem from "../components/shopping-item";
import {GlobalContext, UserType} from "../utils/contexts";
import styled from "@emotion/styled";
import Button, { ButtonType } from "../components/button";
import CheckBox from "../components/checkbox";
import {ModalAddShoppingItem, ModalChangeUsers, ModalEditShoppingListName, ModalConfirmItemDelete, ModalConfirmShoppingListDelete} from "../components/shopping-list-actions";
import EmptyState from "../components/emptyState";
import ShoppingItemsWrapper from "../components/shopping-items-wrapper";

export interface ShoppingItem {
    name: string
    done: boolean
    id: number
}

export interface User {
    name: string
    id: number
    active: boolean
}

const ShoppingList = () => {
    const {activeUser, showContextMenu, shoppingLists, setShoppingLists} = useContext(GlobalContext);

    const {shoppingListName} = useParams();
    const [_, setLocation] = useLocation();

    const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
    const [users, setUsers] = useState<User[]>([
        {name: "Jaromír", id: 1, active: true},
        {name: "Jan", id: 2, active: true},
        {name: "Anna", id: 3, active: true},
    ]);
    const [pageHeader, setPageHeader] = useState("");

    const [modalEditShoppingListName, setModalEditShoppingListName] = useState(false);
    const [modalAddShoppingItem, setModalAddShoppingItem] = useState(false);
    const [modalChangeUsers, setModalChangeUsers] = useState(false);
    const [modalConfirmItemDeleteID, setModalConfirmItemDeleteID] = useState(-1);
    const [modalConfirmShoppingListDelete, setModalConfirmShoppingListDelete] = useState(false);

    const [showDone, setShowDone] = useState(true);

    const optionsRef = useRef(null);

    useEffect(() => {
        switch (shoppingListName) {
            case "uterni-oslava": {
                setPageHeader("Úterní oslava");
                setShoppingItems([
                    {name: "Dort", done: false, id: 1},
                    {name: "Svíčky", done: false, id: 2},
                    {name: "Džus", done: false, id: 3},
                ]);
                break;
            }
            case "stredecni-pivo": {
                setPageHeader("Středeční pivo");
                setShoppingItems([
                    {name: "Pivo", done: false, id: 1},
                    {name: "Okurky", done: false, id: 2},
                ]);
                break;
            }
        }
    }, [shoppingListName]);

    return (
        <>
            <Helmet>
                <meta property="og:title" content={`${location} | PETR LIST}`}/>
                <title>List | PETR LIST</title>
            </Helmet>
            {modalConfirmShoppingListDelete && 
                <ModalConfirmShoppingListDelete
                    shoppingListName={pageHeader}
                    hide={() => setModalConfirmShoppingListDelete(false)}
                    removeShoppingList={() => {
                        let deletedWasFirst = false;
                        setShoppingLists(shoppingLists.filter((shoppingList, i) => {
                            const  willBeDeleted = shoppingList.href == shoppingListName
                            if (willBeDeleted) deletedWasFirst = i == 0;

                            return !willBeDeleted
                        }));

                        if(shoppingLists.length != 1) {
                            if (deletedWasFirst) {
                                setLocation(`/${shoppingLists[1].href}`);
                            } else {
                                setLocation(`/${shoppingLists[0].href}`);
                            }
                        }
                    }}
                />
            }
            {modalConfirmItemDeleteID != -1 &&
                <ModalConfirmItemDelete
                    itemName={shoppingItems.filter(shoppingItem => shoppingItem.id == modalConfirmItemDeleteID)[0].name}
                    removeItem={() => {
                        setShoppingItems(shoppingItems.filter(_shoppingItem => _shoppingItem.id != modalConfirmItemDeleteID)); 
                        setModalConfirmItemDeleteID(-1);
                    }}
                    hide={() => setModalConfirmItemDeleteID(-1)}
                    
                />
            }
            {modalEditShoppingListName &&
                <ModalEditShoppingListName
                    defaultValue={pageHeader}
                    hide={() => setModalEditShoppingListName(false)}
                    setName={(value) => setPageHeader(value)}
                />
            }
            {modalAddShoppingItem && 
                <ModalAddShoppingItem
                    hide={() => setModalAddShoppingItem(false)}
                    addItem={(itemName) => setShoppingItems([
                        ...shoppingItems, 
                        {name: itemName, done: false, id: shoppingItems.length > 0 ? shoppingItems[shoppingItems.length - 1].id + 1 : 1}
                    ])}
                />
            }
            {modalChangeUsers &&
                <ModalChangeUsers
                    users={users}
                    setUsers={setUsers}
                    hide={() => setModalChangeUsers(false)}
                />
            }

            <Wrapper>
                {shoppingLists.length == 0 ? "Žádné nákupní seznamy" :
                    <>
                        <div>
                            <Label>
                                {pageHeader}
                            </Label>
                            
                                <Button 
                                    ref={optionsRef} 
                                    onClick={() => {
                                        switch(activeUser) {
                                            case UserType.OWNER: {
                                                showContextMenu(
                                                    [
                                                        {label: "Změnit název", action: () => setModalEditShoppingListName(true)},
                                                        {label: "Upravit členy", action: () => setModalChangeUsers(true)},
                                                        {label: "Odstranit seznam", action: () => setModalConfirmShoppingListDelete(true)},
                                                    ], optionsRef.current
                                                );
                                                break;
                                            }
                                            case UserType.USER: {
                                                showContextMenu(
                                                    [
                                                        {
                                                            label: "Odejít", 
                                                            action: () => {
                                                                let deletedWasFirst = false;
                                                                setShoppingLists(shoppingLists.filter((shoppingList, i) => {
                                                                    const  willBeDeleted = shoppingList.href == shoppingListName
                                                                    if (willBeDeleted) deletedWasFirst = i == 0;

                                                                    return !willBeDeleted
                                                                }));

                                                                if(shoppingLists.length != 1) {
                                                                    if (deletedWasFirst) {
                                                                        setLocation(`/${shoppingLists[1].href}`);
                                                                    } else {
                                                                        setLocation(`/${shoppingLists[0].href}`);
                                                                    }
                                                                }
                                                            }
                                                        },
                                                    ], optionsRef.current
                                                );
                                                break;
                                            }
                                        }                            
                                    }}
                                >
                                    <i className="fa fa-ellipsis" />
                                </Button>
                        </div>
                        
                        {shoppingItems.length != 0 ? 
                            <>
                                <CheckBox label="Zobrazit dokončené" onClick={() => setShowDone(p => !p)} checked={showDone} />
                                <ShoppingItemsWrapper>
                                    {shoppingItems.filter((shoppingItem) => showDone ? true : shoppingItem.done == false).map((shoppingItem, i) => 
                                        <ShoppingItem 
                                            key={i} 
                                            onDelete={() => setModalConfirmItemDeleteID(shoppingItem.id)}
                                            done={shoppingItem.done} 
                                            onDoneToogle={() => {
                                                let newItems = [...shoppingItems];
                                                for (const newItem of newItems) {
                                                    if (newItem.id == shoppingItem.id) {
                                                        newItem.done = !newItem.done;
                                                        break;
                                                    }
                                                }
                                                setShoppingItems(newItems);
                                            }}
                                        >
                                            {shoppingItem.name}
                                        </ShoppingItem>
                                    )}
                                </ShoppingItemsWrapper>
                            </>    
                            :
                            <EmptyState
                                label="Žádné položky"
                                description="Tento nákupní seznam nemá žádné položky"
                            />
                    }
                        
                        <div style={{display: "flex", "justifyContent": "center"}}>
                            <Button onClick={() => setModalAddShoppingItem(true)} buttonType={ButtonType.PRIMARY}>
                                Přidat Položku
                            </Button>
                        </div>
                    </>
                }
            </Wrapper>
        </>
    );
}

const Label = styled("h3")`
    font: ${p => p.theme.fontStyles.h3};
`;

const Wrapper = styled("div")`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;

    > div:first-of-type {
        display: flex;
        align-content: center;
        gap: 20px;
    }
`;

export default ShoppingList;