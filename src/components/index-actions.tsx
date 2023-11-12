import { FC, useContext } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext } from "../utils/contexts";
import Button, { ButtonType } from "./button";
import Input from "./input";
import { ModalButtons } from "./modal";
import ModalForm from "./modal-form";

interface ModalAddShoppingListProps {
    hide: () => void
}

interface ModalAddShoppingListFrom {
    name: string
}

export const ModalAddShoppingList: FC<ModalAddShoppingListProps> = ({hide}) => {
    const { control, handleSubmit } = useForm<ModalAddShoppingListFrom>({ defaultValues: { name: "" } });
    const {setShoppingLists, shoppingLists} = useContext(GlobalContext);

    function onSubmit(data: ModalAddShoppingListFrom) {
        setShoppingLists([...shoppingLists, {label: data.name, href: encodeURI(data.name), archived: false}])
        hide();
    }

    return (
        <ModalForm 
            onSubmit={handleSubmit(onSubmit)}
            heading="Přidat nákupní seznam" 
            hide={hide}
        >
            <Input 
                name="name" 
                control={control} 
                rules={{ required: { message: "Vyplňte prosím název nákupního seznamu", value: true } }}
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
