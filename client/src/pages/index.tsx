import styled from "@emotion/styled";
import { useContext, useState } from "react";
import useSWR from "swr";
import Button, { ButtonType } from "../components/button";
import HomeLink from "../components/home-link";
import { ModalAddShoppingList } from "../components/index-actions";
import { GlobalContext, ShoppingListType } from "../utils/contexts";
import ErrorPage from "./error-page";

const HomePage = () => {
    const { setShowArchived } = useContext(GlobalContext);
    const [modalAddShoppingList, setModalAddShoppingList] = useState(false);

    const { data, error, mutate } = useSWR<ShoppingListType[]>("shopping-list");

    if (error) return <ErrorPage/>;

    if (!data) return <>Načítání...</>;

    return (
        <>
            {modalAddShoppingList && 
                <ModalAddShoppingList hide={async(refetch: boolean) =>{ 
                    if (refetch) await mutate();
                    setModalAddShoppingList(false);
                }}/>
            }
            <Wrapper>
                <Label>
                    Nákupní seznamy
                </Label>
                <div>
                    {data.sort((a, b) => {
                                        if(a.archived == b.archived) return 0;
                                        if (a.archived) return 1;
                                        return -1;
                                    }).map((shoppingList, i) =>
                        <HomeLink 
                            onClick={shoppingList.archived ? () => setShowArchived(true) : undefined}
                            key={i}
                            href={`/${shoppingList.slug}`}
                            label={shoppingList.name}
                            trailing={shoppingList.archived ?  <i className="fa fa-box-archive" /> : undefined}
                        />
                    )}
                </div>
                <Button onClick={() => setModalAddShoppingList(true)} buttonType={ButtonType.PRIMARY}>
                    Přidat nový nákupní seznam
                </Button>
            </Wrapper>
        </>
    );
}

const Wrapper = styled("div")`
    display: flex;
    flex-direction: column;

    > div {
        display: flex;

        gap: 15px;
        margin-bottom: 20px;
    }
`;


const Label = styled("h2")`
    ${p => p.theme.fontStyles.h2};
    margin-bottom: 60px;
`;

export default HomePage;