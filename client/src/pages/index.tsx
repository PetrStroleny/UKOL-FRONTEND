import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Button, { ButtonType } from "../components/button";
import HomeLink from "../components/home-link";
import { ModalAddShoppingList } from "../components/index-actions";
import { GlobalContext, ShoppingListType, getTextAfterLanguage } from "../utils/contexts";
import ErrorPage from "./error-page";
import Chart from "chart.js/auto";
import { Theme } from "../style-variables";

const HomePage = () => {
    const { setShowArchived, activeLanguage } = useContext(GlobalContext);
    
    const [modalAddShoppingList, setModalAddShoppingList] = useState(false);

    const { data, error, mutate } = useSWR<ShoppingListType[]>("shopping-list");

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
                  type: "bar",
                  options: {
                    ticks: {
                        precision:0
                      },
                    scales: {
                      y: {
                        beginAtZero: true,
        
                      }
                    }
                  },
                  data: {
                      labels: data.filter(shoppingList => !shoppingList.archived).map(shoppingList => shoppingList.name),
                      datasets: [
                        {
                            barPercentage: 0.4,
                            backgroundColor: Theme.primitives.green,
                            label: getTextAfterLanguage("Počet položek", "Number of items", activeLanguage),
                            data: data.filter(shoppingList => !shoppingList.archived).map(shoppingList => shoppingList.shoppingItems.length)
                        }
                    ]
                  }
                }
            ));
        }
    }, [data, activeLanguage]);

    if (error) return <ErrorPage/>;

    if (!data) return <>{getTextAfterLanguage("Náčítání...", "Loading...", activeLanguage)}</>;

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
                    {getTextAfterLanguage("Nákupní seznamy", "Shopping lists", activeLanguage)}
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
                    {getTextAfterLanguage("Přidat nový nákupní seznam", "Add new shopping list", activeLanguage)}
                </Button>
                <canvas id="canvas" style={{minHeight: "400px", maxHeight: "400px"}}/>
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

        @media only screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
            flex-direction: column;
        }
    }
`;


const Label = styled("h2")`
    ${p => p.theme.fontStyles.h2};
    margin-bottom: 60px;
`;

export default HomePage;