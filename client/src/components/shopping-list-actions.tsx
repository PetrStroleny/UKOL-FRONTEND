import styled from "@emotion/styled";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Button, { ButtonType } from "./button";
import Input from "./input";
import Modal, { ModalButtons, ModalDescription } from "./modal";
import ModalForm from "./modal-form";
import { GENERAL_ERROR_MESSAGE, postData } from "../network";
import { GlobalContext, User, getTextAfterLanguage } from "../utils/contexts";
import { useLocation } from "wouter";
import { validateIsNumber } from "../utils/form";

interface ModalArchiveProps {
    archived: boolean
    hide: (refetch?: boolean) => Promise<void>
    id: number
    shoppingListName: string
}

export const ModalArchive: FC<ModalArchiveProps> = ({hide, id, shoppingListName, archived}) => {
    const { activeUserToken } = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);

    async function toggleArchivedShoppingList() {
        try {
            setLoading(true);
            await postData(`shopping-list/toggle-archived/${id}`, {}, activeUserToken);
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
            heading={archived ? `Zrušit archovaci ${shoppingListName}` : `Archivovat ${shoppingListName}`}
            hide={hide}
        >
            <ModalDescription>
                Opravdu chcete {archived ? `zrušit archovaci ${shoppingListName}` : `archivovat ${shoppingListName}`}?
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={toggleArchivedShoppingList} buttonType={ButtonType.TERTIARY}>
                    {archived ? "Zrušit archovaci" : "Archivovat"}
                    </Button>
                </div>
            </ModalButtons>
        </Modal>
    );
}

interface ModalEditShoppingListNameProps {
    defaultValue: string
    hide: (newSlug?: string) => Promise<void>
    id: number
}

interface ModalEditShoppingListNameFrom {
    name: string
}

export const ModalEditShoppingListName: FC<ModalEditShoppingListNameProps> = ({hide, id, defaultValue}) => {
    const { activeUserToken, activeLanguage } = useContext(GlobalContext);

    const { control, handleSubmit } = useForm<ModalEditShoppingListNameFrom>({ defaultValues: { name: defaultValue } });

    const [loading, setLoading] = useState(false);

    async function onSubmit(data: ModalEditShoppingListNameFrom) {
        try {
            setLoading(true);
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
            heading={getTextAfterLanguage("Změnit název nákupního listu", "Change name of shopping list", activeLanguage)}
            hide={hide}
        >
            <Input 
                name="name" 
                control={control} 
                rules={{ required: { message: getTextAfterLanguage("Vyplňte prosím název nákupního list", "Please fill name of shopping list", activeLanguage), value: true } }}
                placeholder="Název"
            />

            <ModalButtons>
                <div>
                    <Button disabled={loading} type="button" onClick={() => hide()}>
                        {getTextAfterLanguage("Zrušit", "Cancel", activeLanguage)}
                    </Button>
                </div>
                <div>
                    <Button loading={loading} buttonType={ButtonType.PRIMARY}>
                        {getTextAfterLanguage("Potvrdit", "Change", activeLanguage)}
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
    count: number
}

export const ModalAddShoppingItem: FC<ModalAddShoppingItemProps> = ({hide, id}) => {
    const { activeUserToken, activeLanguage } = useContext(GlobalContext);

    const { control, handleSubmit } = useForm<ModalAddShoppingItemFrom>({ defaultValues: { name: "", count: 1 } });

    const [customPriceError, setCustomPriceError] = useState("");

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
            heading={getTextAfterLanguage("Přidat položku", "Add item", activeLanguage)}
            hide={hide}
        >
            <Input 
                name="name" 
                control={control} 
                rules={{ required: { message: getTextAfterLanguage("Vyplňte prosím název položky", "Please fill the name of item", activeLanguage), value: true } }}
                placeholder={getTextAfterLanguage("Název", "Name", activeLanguage)}
            />

            <Input 
                name="count" 
                control={control} 
                number
                customError={customPriceError ?? ""}
                rules={{ 
                    required: { message: getTextAfterLanguage("Vyplňte prosím počet položek", "Plase add the number of items", activeLanguage), value: true },
                    validate: (value: string) => validateIsNumber(
                        value, 
                        setCustomPriceError, 
                        999, 
                        false, 
                        {
                            negativeError: getTextAfterLanguage("Počet položek musí být kladné číslo", "The number of items must be positive", activeLanguage), 
                            maxValueError: getTextAfterLanguage("Počet položky musí být menší než-li 999", "The number of items must be lower than 999", activeLanguage)
                        },
                    ) 
                }}
                placeholder={getTextAfterLanguage("Počet", "Number of items", activeLanguage)}
            />

            <ModalButtons>
                <div>
                    <Button disabled={loading} type="button" onClick={() => hide()}>
                        {getTextAfterLanguage("Zrušit", "Cancel", activeLanguage)}
                    </Button>
                </div>
                <div>
                    <Button loading={loading} buttonType={ButtonType.PRIMARY}>
                        {getTextAfterLanguage("Přidat", "Add", activeLanguage)}
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
    const { activeUserToken, activeLanguage } = useContext(GlobalContext);

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
            heading={`${getTextAfterLanguage("Odstranit", "Remove", activeLanguage)} ${shoppingListName}`}
            hide={hide}
        >
            <ModalDescription>
                Opravdu chcete odstranit nákupní seznam {shoppingListName}?
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                    {getTextAfterLanguage("Zrušit", "Cancel", activeLanguage)}
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={removeShoppingList} buttonType={ButtonType.TERTIARY}>
                    {getTextAfterLanguage("Odstranit", "Remove", activeLanguage)}
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
    const { activeUserToken, activeLanguage } = useContext(GlobalContext);

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
            {getTextAfterLanguage("Opravdu chcete odstranit položku", "Do you really want to remove", activeLanguage)}
            {itemName}
            {getTextAfterLanguage("z nákupního listu?", "from the shopping list", activeLanguage)}
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                    {getTextAfterLanguage("Zrušit", "Cancel", activeLanguage)}
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={removeItem} buttonType={ButtonType.TERTIARY}>
                    {getTextAfterLanguage("Odstranit", "Remove", activeLanguage)}
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
    const { activeUserToken, activeLanguage } = useContext(GlobalContext);

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
            {getTextAfterLanguage("Opravdu chcete odejít z nákupního listu", "Do you really want to leave shopping list", activeLanguage)} {name} ?
            </ModalDescription>

            <ModalButtons>
                <div>
                    <Button disabled={loading} onClick={() => hide()}>
                    {getTextAfterLanguage("Zrušit", "Cancel", activeLanguage)}
                    </Button>
                </div>
                <div>
                    <Button loading={loading} onClick={leaveShoppingList} buttonType={ButtonType.TERTIARY}>
                        {getTextAfterLanguage("Odejít", "Leave", activeLanguage)}
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
    const { activeUserToken, activeLanguage } = useContext(GlobalContext);

    const [activeUsers, setActiveUsers] = useState(_activeUsers);

    const [loading, setLoading] = useState(false);

    async function changeMembers() {
        try {
            setLoading(true);
            await postData("shopping-list/change-members", {members: activeUsers, id}, activeUserToken);
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
            heading={getTextAfterLanguage("Upravit členy", "Edit users", activeLanguage)} 
            hide={hide}
        >
            <Wrapper>
                {users.filter(user => user.token != activeUserToken).map((user, i) => 
                    <UserItem 
                        className="hover-active"
                        onClick={() => {
                            if (activeUsers.includes(user._id)) {
                                setActiveUsers(activeUsers.filter(userID => userID != user._id));
                                return;
                            }
                            setActiveUsers([...activeUsers, user._id]);
                        }}
                        key={i}
                    >
                        <p>
                            {user.name}
                        </p>
                        <Button>
                            {activeUsers.includes(user._id) ? 
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
                    {getTextAfterLanguage("Zrušit", "Cancel", activeLanguage)}
                    </Button>
                </div>
                <div>
                    <Button
                        loading={loading}
                        onClick={changeMembers}  
                        buttonType={ButtonType.PRIMARY}
                    >
                        {getTextAfterLanguage("Potvrdit", "Edit", activeLanguage)}
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