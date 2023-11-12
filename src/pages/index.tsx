import styled from "@emotion/styled";
import { useContext, useState } from "react";
import HomeLink from "../components/home-link";
import { GlobalContext } from "../utils/contexts";
import Button, { ButtonType } from "../components/button";
import {ModalAddShoppingList} from "../components/index-actions";

const HomePage = () => {
    const {shoppingLists, setShowArchived} = useContext(GlobalContext);
    const [modalAddShoppingList, setModalAddShoppingList] = useState(false);

    return (
        <>
            {modalAddShoppingList && 
                <ModalAddShoppingList hide={() => setModalAddShoppingList(false)}/>
            }
            <Wrapper>
                <Label>
                    Nákupní seznamy
                </Label>
                <div>
                    {shoppingLists.sort((a, b) => {
                                        if(a.archived == b.archived) return 0;
                                        if (a.archived) return 1;
                                        return -1;
                                    }).map((shoppingList, i) =>
                        <HomeLink 
                            onClick={shoppingList.archived ? () => setShowArchived(true) : undefined}
                            key={i}
                            href={`/${shoppingList.href}`}
                            label={shoppingList.label}
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