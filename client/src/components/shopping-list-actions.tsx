import styled from "@emotion/styled";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../pages/shopping-list";
import Button, { ButtonType } from "./button";
import Input from "./input";
import Modal, { ModalButtons, ModalDescription } from "./modal";
import ModalForm from "./modal-form";
import { GENERAL_ERROR_MESSAGE, postData } from "../network";
import { GlobalContext } from "../utils/contexts";
import { useLocation } from "wouter";

interface ModalEditShoppingListNameProps {
    defaultValue: string
    hide: (newSlug?: string) => Promise<void>
    id: number
}

interface ModalEditShoppingListNameFrom {
    name: string
}

export const ModalEditShoppingListName: FC<ModalEditShoppingListNameProps> = ({hide, id, defaultValue}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const { control, handleSubmit } = useForm<ModalEditShoppingListNameFrom>({ defaultValues: { name: defaultValue } });

    const [loading, setLoading] = useState(false);

    async function onSubmit(data: ModalEditShoppingListNameFrom) {
        try {
            setLoading(true);
            console.log(id);
            const res = await postData("shopping-list/edit-or-create", {...data, id}, activeUserToken);
            const body = await res.json();
            await hide(body?.slug);
        } catch(e) {
            console.error(e);
            alert(GENERAL_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ModalForm 
            onSubmit={handleSubmit(onSubmit)}
            heading="Změnit název nákupního listu" 
            hide={hide}
        >
            <Input 
                name="name" 
                control={control} 
                rules={{ required: { message: "Vyplňte prosím název nákupního list", value: true } }}
                placeholder="Název"
            />

            <ModalButtons>
                <div>
                    <Button disabled={loading} type="button" onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button loading={loading} buttonType={ButtonType.PRIMARY}>
                        Potvrdit
                    </Button>
                </div>
            </ModalButtons>
        </ModalForm>
    );
}

interface ModalAddShoppingItemProps {
    hide: (refetch?: boolean) => Promise<void>
    id: number
}

interface ModalAddShoppingItemFrom {
    name: string
}

export const ModalAddShoppingItem: FC<ModalAddShoppingItemProps> = ({hide, id}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const { control, handleSubmit } = useForm<ModalAddShoppingItemFrom>({ defaultValues: { name: "" } });

    const [loading, setLoading] = useState(false);

    async function onSubmit(data: ModalEditShoppingListNameFrom) {
        try {
            setLoading(true);
            await postData("shopping-item/create", {...data, "shopping-list-id": id}, activeUserToken);
            await hide(true);
        } catch(e) {
            console.error(e);
            alert(GENERAL_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ModalForm 
            onSubmit={handleSubmit(onSubmit)}
            heading="Přidat položku" 
            hide={hide}
        >
            <Input 
                name="name" 
                control={control} 
                rules={{ required: { message: "Vyplňte prosím název položky", value: true } }}
                placeholder="Název"
            />

            <ModalButtons>
                <div>
                    <Button disabled={loading} type="button" onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button loading={loading} buttonType={ButtonType.PRIMARY}>
                        Přidat
                    </Button>
                </div>
            </ModalButtons>
        </ModalForm>
    );
}

interface ModalConfirmShoppingListDeleteProps {
    shoppingListName: string
    hide: (refetch?: boolean) => Promise<void>
    id: number
}

export const ModalConfirmShoppingListDelete: FC<ModalConfirmShoppingListDeleteProps> = ({hide, id, shoppingListName}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const [_, setLocation] = useLocation();

    const [loading, setLoading] = useState(false);

    async function removeShoppingList() {
        try {
            setLoading(true);
            await postData(`shopping-list/delete/${id}`, {}, activeUserToken, "DELETE");
            await hide(true);
            setLocation("/");

        } catch(e) {
            console.error(e);
            alert(GENERAL_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            heading={`Odstranit ${shoppingListName}`}
            hide={hide}
        >
            <ModalDescription>
                Opravdu chcete odstranit nákupní seznam {shoppingListName}?
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={removeShoppingList} buttonType={ButtonType.TERTIARY}>
                        Odstranit
                    </Button>
                </div>
            </ModalButtons>
        </Modal>
    );
}

interface ModalConfirmItemDeleteProps {
    id: number
    name: string
    hide: (refetch?: boolean) => Promise<void>
}

export const ModalConfirmItemDelete: FC<ModalConfirmItemDeleteProps> = ({hide, id, name: itemName}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);

    async function removeItem() {
        try {  
            setLoading(true);
            await postData(`shopping-item/delete/${id}`, {}, activeUserToken, "DELETE");
            await hide(true);
        } catch(e) {
            console.error(e);
            alert(GENERAL_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            heading={`Odstranit ${itemName}`}
            hide={hide}
        >
            <ModalDescription>
                Opravdu chcete odstranit položku {itemName} z nákupního listu?
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={removeItem} buttonType={ButtonType.TERTIARY}>
                        Odstranit
                    </Button>
                </div>
            </ModalButtons>
        </Modal>
    );
}

interface ModalLeaveShoppingListProps {
    id: number
    name: string
    hide: (refetch?: boolean) => Promise<void>
}

export const ModalLeaveShoppingList: FC<ModalLeaveShoppingListProps> = ({name, hide, id}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);

    const [_, setLocation] = useLocation();

    async function leaveShoppingList() {
        try {
            setLoading(true);
            await postData(`shopping-list/leave/${id}`, {}, activeUserToken);
            await hide(true);
            setLocation("/");
        } catch(e) {
            console.error(e);
            alert(GENERAL_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            heading={`Odejít z ${name}`}
            hide={hide}
        >
            <ModalDescription>
                Opravdu chcete odejít z nákupního listu {name} ?
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={leaveShoppingList} buttonType={ButtonType.TERTIARY}>
                        Odejít
                    </Button>
                </div>
            </ModalButtons>
        </Modal>
    );
}

interface ModalChangeUsersProps {
    _activeUsers: number[]
    hide: (refetch?: boolean) => Promise<void>
    users: User[]
    id: number
}

export const ModalChangeUsers: FC<ModalChangeUsersProps> = ({hide, users, id, _activeUsers}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const [activeUsers, setActiveUsers] = useState(_activeUsers);

    const [loading, setLoading] = useState(false);

    async function changeMembers() {
        try {
            setLoading(true);
            await postData("shopping-list/change-members", {members: activeUsers, id: id}, activeUserToken);
            await hide(true);
        } catch(e) {
            console.error(e);
            alert(GENERAL_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            heading="Upravit členy" 
            hide={hide}
        >
            <Wrapper>
                {users.filter(user => user.token != activeUserToken).map((user, i) => 
                    <UserItem 
                        className="hover-active"
                        onClick={() => {
                            if (activeUsers.includes(user.id)) {
                                setActiveUsers(activeUsers.filter(userID => userID != user.id));
                                return;
                            }
                            setActiveUsers([...activeUsers, user.id]);
                        }}
                        key={i}
                    >
                        <p>
                            {user.name}
                        </p>
                        <Button>
                            {activeUsers.includes(user.id) ? 
                                <i className="fa fa-check" /> 
                                    : 
                                <i className="fa fa-xmark" />    
                            }
                        </Button>
                    </UserItem>
                )}
            </Wrapper>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button
                        loading={loading}
                        onClick={changeMembers}  
                        buttonType={ButtonType.PRIMARY}
                    >
                        Potvrdit
                    </Button>
                </div>
            </ModalButtons>
        </Modal>
    );
}

const Wrapper = styled("div")`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px 0px;
`;

const UserItem = styled("div")`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;
    padding: 10px;
    width: 100%;
    border: 1px solid ${p => p.theme.content.secondary};
    border-radius: 4px;
    font: ${p => p.theme.fontStyles.b2};
`;