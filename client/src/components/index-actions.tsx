import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GENERAL_ERROR_MESSAGE, postData } from "../network";
import { GlobalContext } from "../utils/contexts";
import Button, { ButtonType } from "./button";
import Input from "./input";
import { ModalButtons } from "./modal";
import ModalForm from "./modal-form";

interface ModalAddShoppingListProps {
    hide: (refetch: boolean) => Promise<void>
}

interface ModalAddShoppingListFrom {
    name: string
}

export const ModalAddShoppingList: FC<ModalAddShoppingListProps> = ({hide}) => {
    const { control, handleSubmit } = useForm<ModalAddShoppingListFrom>({ defaultValues: { name: "" } });
    const [loading, setLoading] = useState(false);
    const { activeUserToken } = useContext(GlobalContext);

    async function onSubmit(data: ModalAddShoppingListFrom) {
        try {
            setLoading(true);
            await postData("shopping-list/edit-or-create", {...data, id: 0}, activeUserToken);
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
            heading="Přidat nákupní seznam" 
            hide={() => hide(false)}
        >
            <Input 
                name="name" 
                control={control} 
                rules={{ required: { message: "Vyplňte prosím název nákupního seznamu", value: true } }}
                placeholder="Název"
            />

            <ModalButtons>
                <div>
                    <Button disabled={loading} type="button" onClick={() => hide(false)}>
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
