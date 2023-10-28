import styled from "@emotion/styled";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../pages/shopping-list";
import Button, { ButtonType } from "./button";
import Input from "./input";
import Modal, { ModalButtons, ModalDescription } from "./modal";
import ModalForm from "./modal-form";

interface ModalEditShoppingListNameProps {
    defaultValue: string
    setName: (value: string) => void
    hide: () => void
}

interface ModalEditShoppingListNameFrom {
    name: string
}

export const ModalEditShoppingListName: FC<ModalEditShoppingListNameProps> = ({hide, defaultValue, setName}) => {
    const { control, handleSubmit } = useForm<ModalEditShoppingListNameFrom>({ defaultValues: { name: defaultValue } });

    function onSubmit(data: ModalEditShoppingListNameFrom) {
        setName(data.name);
        hide();
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
                    <Button type="button" onClick={hide}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button  buttonType={ButtonType.PRIMARY}>
                        Potvrdit
                    </Button>
                </div>
            </ModalButtons>
        </ModalForm>
    );
}

interface ModalAddShoppingItemProps {
    addItem: (itemName: string) => void
    hide: () => void
}

interface ModalAddShoppingItemFrom {
    name: string
}

export const ModalAddShoppingItem: FC<ModalAddShoppingItemProps> = ({hide, addItem}) => {
    const { control, handleSubmit } = useForm<ModalAddShoppingItemFrom>({ defaultValues: { name: "" } });

    function onSubmit(data: ModalEditShoppingListNameFrom) {
        addItem(data.name);
        hide();
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
                    <Button type="button" onClick={hide}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button buttonType={ButtonType.PRIMARY}>
                        Přidat
                    </Button>
                </div>
            </ModalButtons>
        </ModalForm>
    );
}

interface ModalConfirmShoppingListDeleteProps {
    removeShoppingList: () => void
    shoppingListName: string
    hide: () => void
}

export const ModalConfirmShoppingListDelete: FC<ModalConfirmShoppingListDeleteProps> = ({hide, removeShoppingList, shoppingListName}) => (
    <Modal
        heading={`Odstranit ${shoppingListName}`}
        hide={hide}
    >
        <ModalDescription>
            Opravdu chcete odstranit nákupní seznam {shoppingListName}?
        </ModalDescription>

        <ModalButtons>
            <div>
                <Button onClick={hide}>
                    Zrušit
                </Button>
            </div>
            <div>
                <Button onClick={removeShoppingList} buttonType={ButtonType.TERTIARY}>
                    Odstranit
                </Button>
            </div>
        </ModalButtons>
    </Modal>
);

interface ModalConfirmItemDeleteProps {
    removeItem: () => void
    itemName: string
    hide: () => void
}

export const ModalConfirmItemDelete: FC<ModalConfirmItemDeleteProps> = ({hide, removeItem, itemName}) => (
    <Modal
        heading={`Odstranit ${itemName}`}
        hide={hide}
    >
        <ModalDescription>
            Opravdu chcete odstranit položku {itemName} z nákupního listu?
        </ModalDescription>

        <ModalButtons>
            <div>
                <Button onClick={hide}>
                    Zrušit
                </Button>
            </div>
            <div>
                <Button onClick={removeItem} buttonType={ButtonType.TERTIARY}>
                    Odstranit
                </Button>
            </div>
        </ModalButtons>
    </Modal>
);

interface ModalChangeUsersProps {
    users: User[]
    setUsers: (users: User[]) => void
    hide: () => void
}

export const ModalChangeUsers: FC<ModalChangeUsersProps> = ({hide, users, setUsers}) => {
    const [activeUsers, setActiveUsers] = useState(users)

    return (
        <Modal
            heading="Upravit členy" 
            hide={hide}
        >
            <Wrapper>
                {activeUsers.map((user, i) => 
                    <UserItem 
                        className="hover-active"
                        onClick={() => {
                            setActiveUsers(activeUsers.map(activeUser => activeUser.id == user.id ? 
                                {...activeUser, active: !activeUser.active} 
                                    : 
                                activeUser
                            ));
                        }}
                        key={i}
                    >
                        <p>
                            {user.name}
                        </p>
                        <Button>
                            {user.active ? 
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
                    <Button onClick={hide}>
                        Zrušit
                    </Button>
                </div>
                <div>
                    <Button onClick={() => {setUsers(activeUsers); hide();}}  buttonType={ButtonType.PRIMARY}>
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