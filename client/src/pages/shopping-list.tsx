import styled from "@emotion/styled";
import { useContext, useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams } from "wouter";
import Button, { ButtonType } from "../components/button";
import CheckBox from "../components/checkbox";
import EmptyState from "../components/emptyState";
import ShoppingItem from "../components/shopping-item";
import ShoppingItemsWrapper from "../components/shopping-items-wrapper";
import { ModalAddShoppingItem, ModalArchive, ModalChangeUsers, ModalConfirmItemDelete, ModalConfirmShoppingListDelete, ModalEditShoppingListName, ModalLeaveShoppingList } from "../components/shopping-list-actions";
import { GENERAL_ERROR_MESSAGE, postData } from "../network";
import { GlobalContext, ShoppingListType, User, getTextAfterLanguage } from "../utils/contexts";
import ErrorPage from "./error-page";
import { Chart } from "chart.js";
import { Theme } from "../style-variables";

export interface ShoppingItemType {
    _id: number
    name: string
    done: boolean
    count: number
}

const ShoppingList = () => {
    const {shoppingListSlug} = useParams();
    const { data, error, mutate: mutateShoppingList } = useSWR<{list: ShoppingListType, items: ShoppingItemType[], users: User[]}>(`shopping-list/${shoppingListSlug}`);
    
    const { activeUserToken, showContextMenu, showArchived, setShowArchived, activeLanguage } = useContext(GlobalContext);

    const [modalEditShoppingListName, setModalEditShoppingListName] = useState(false);
    const [modalAddShoppingItem, setModalAddShoppingItem] = useState(false);
    const [modalChangeUsers, setModalChangeUsers] = useState(false);
    const [modalConfirmItemDeleteID, setModalConfirmItemDeleteID] = useState(-1);
    const [modalConfirmShoppingListDelete, setModalConfirmShoppingListDelete] = useState(false);
    const [modalArchive, setModalArchive] = useState(false);
    const [modalLeaveShoppingListActive, setModalLeaveShoppingListActive] = useState(false);

    const [showDone, setShowDone] = useState(true);

    const optionsRef = useRef(null);

    useEffect(() => {
        if (data?.list.archived && !showArchived) setShowArchived(true); 
    }, [data]);

    const [currentChart, setCurrentChart] = useState<any>();
    useEffect(() => {
        if (data) {
            console.log(data);
            if (currentChart) {
                currentChart.destroy();
            }
            setCurrentChart(new Chart(
                document.getElementById("canvas"),
                {
                  type: "pie",
                  data: {
                    labels: [
                        getTextAfterLanguage("Vyřešené", "Done", activeLanguage),
                        getTextAfterLanguage("Nevyřešené", "Open", activeLanguage),
                      ],
                      datasets: [{
                        label: 'My First Dataset',
                        data: [data.items.filter(item => item.done).length, data.items.filter(item => !item.done).length],
                        backgroundColor: [
                          Theme.primitives.green,
                          Theme.primitives.error,
                        ],
                        hoverOffset: 4
                      }]
                  }
                }
            ));
        }
    }, [data, activeLanguage]);

    if (error) return <ErrorPage/>;

    if (!data) return <>{getTextAfterLanguage("Náčítání...", "Loading...", activeLanguage)}</>
    
    return (
        <>
            {modalArchive &&
                <ModalArchive
                    shoppingListName={data.list.name}
                    archived={data.list.archived}
                    hide={async(refetch?: boolean) => {
                        if (refetch) {
                            if (!data.list.archived) setShowArchived(true);
                            await mutateShoppingList();
                            await mutate("shopping-list");
                        }
                        setModalArchive(false);
                    }}
                    id={data.list._id}
                />
            }
            {modalConfirmShoppingListDelete && 
                <ModalConfirmShoppingListDelete
                    shoppingListName={data.list.name}
                    hide={async(refetch?: boolean) => {
                        if (refetch) await mutateShoppingList();
                        setModalConfirmShoppingListDelete(false);
                    }}
                    id={data.list._id}
                />
            }
            {modalConfirmItemDeleteID != -1 &&
                <ModalConfirmItemDelete
                    name={data.items.filter((item) => item._id == modalConfirmItemDeleteID)[0]?.name}
                    id={modalConfirmItemDeleteID}
                    hide={async(refetch?: boolean) => {
                        setModalConfirmItemDeleteID(-1);
                        if (refetch) await mutateShoppingList();
                    }}
                    
                />
            }
            {modalEditShoppingListName &&
                <ModalEditShoppingListName
                    defaultValue={data.list.name}
                    hide={async(newSlug?: string) => {
                        if (typeof newSlug == "string") {
                            window.location.href = `/${newSlug}`;
                            await mutateShoppingList();
                            await mutate("shopping-list");
                        }
                        setModalEditShoppingListName(false);
                    }}
                    id={data.list._id}
                />
            }
            {modalAddShoppingItem && 
                <ModalAddShoppingItem
                    hide={async(refetch?: boolean) => {
                        if (refetch) await mutateShoppingList();
                        setModalAddShoppingItem(false);
                    }}
                    id={data.list._id}
                />
            }
            {modalChangeUsers &&
                <ModalChangeUsers
                    id={data.list._id}
                    _activeUsers={data.list.members}
                    users={data.users}
                    hide={async(refetch) => {
                        if (refetch) await mutateShoppingList();
                        setModalChangeUsers(false);
                    }}
                />
            }
            {modalLeaveShoppingListActive && 
                <ModalLeaveShoppingList
                    id={data.list._id}
                    name={data.list.name}
                    hide={async(refetch?: boolean) => {
                        if (refetch) await mutateShoppingList();
                        setModalLeaveShoppingListActive(false);
                    }}
                />
            }

            <Wrapper>
                {
                    <>
                        <div>
                            <Label>
                                {data.list.name}
                            </Label>
                            
                            <Button 
                                ref={optionsRef} 
                                onClick={() => {
                                    if (data.users.filter(user => user._id == data.list.owner)[0]?.token == activeUserToken) {
                                        showContextMenu(
                                            [
                                                {
                                                    label: getTextAfterLanguage("Změnit název", "Change name", activeLanguage), 
                                                    action: () => setModalEditShoppingListName(true),
                                                },
                                                {
                                                    label: data.list.archived ? getTextAfterLanguage("Zrušit archivaci", "Cancel archivation", activeLanguage) : getTextAfterLanguage("Archivovat", "Archive", activeLanguage), 
                                                    action: () => setModalArchive(true),
                                                },
                                                {
                                                    label: getTextAfterLanguage("Upravit členy", "Edit users", activeLanguage), 
                                                    action: () => setModalChangeUsers(true),
                                                },
                                                {
                                                    label: getTextAfterLanguage("Odstranit seznam", "Delete shopping list", activeLanguage), 
                                                    action: () => setModalConfirmShoppingListDelete(true),
                                                },
                                            ], optionsRef.current
                                        );
                                        return;
                                    }
                                    showContextMenu(
                                        [
                                            {
                                                label: getTextAfterLanguage("Odejít", "Leave", activeLanguage), 
                                                action: () => setModalLeaveShoppingListActive(true),
                                            },
                                        ], optionsRef.current
                                    );                           
                                }}
                            >
                                <i className="fa fa-ellipsis white-text" />
                            </Button>
                        </div>
                        
                        {data.items.length != 0 ? 
                            <>
                                <CheckBox label={getTextAfterLanguage("Zobrazit dokončené", "Show done", activeLanguage)} onClick={() => setShowDone(p => !p)} checked={showDone} />
                                <ShoppingItemsWrapper>
                                    {data.items.sort((a, b) => {
                                    if(a.done == b.done) return 0;
                                    if (a.done) return 1;
                                    return -1;
                                }).filter((shoppingItem) => showDone ? true : shoppingItem.done == false).map((shoppingItem, i) => 
                                        <ShoppingItem 
                                            key={i} 
                                            onDelete={() => setModalConfirmItemDeleteID(shoppingItem._id)}
                                            {...shoppingItem}
                                            onDoneToogle={async () => {
                                                try {
                                                    await postData(`shopping-item/toggle-done/${shoppingItem._id}`, {}, activeUserToken);
                                                    await mutateShoppingList();
                                                } catch (e) {
                                                    console.error(e);
                                                    alert(GENERAL_ERROR_MESSAGE);
                                                }
                                            }}
                                        >
                                            {shoppingItem.name}
                                        </ShoppingItem>
                                    )}
                                </ShoppingItemsWrapper>
                            </>    
                            :
                            <EmptyState
                                label={getTextAfterLanguage("Žádné položky", "No items", activeLanguage)}
                                description={getTextAfterLanguage("Tento nákupní seznam nemá žádné položky", "This shopping list has no items", activeLanguage)}
                            />
                    }
                        
                        <div style={{display: "flex", "justifyContent": "center"}}>
                            <Button onClick={() => setModalAddShoppingItem(true)} buttonType={ButtonType.PRIMARY}>       
                                {getTextAfterLanguage("Přidat Položku", "Add item", activeLanguage)}
                            </Button>
                        </div>
                    </>
                }
                {data.items.length != 0 &&
                    <canvas id="canvas" style={{minHeight: "400px", maxHeight: "400px"}}/>
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