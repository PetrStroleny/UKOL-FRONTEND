import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import LeftPanel from "./components/left-panel";
import ErrorPage from "./pages/error-page";
import ShoppingList from "./pages/shopping-list";
import { ContextMenuRenderer, ContextMenu, ContextMenuItem, CursorPosition } from "./components/context-menu";
import { GlobalContext, UserType, ShoppingListType } from "./utils/contexts";

function App() {

  const [_, setLocation] = useLocation();

  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [activeUser, setActiveUser] = useState<UserType>(UserType.OWNER);
  const [shoppingLists, setShoppingLists] = useState<ShoppingListType[]>([
    {label: "Úterní oslava", href: "uterni-oslava"},
    {label: "Středeční pivo", href: "stredecni-pivo"},
  ]);

  function showContextMenu(items: ContextMenuItem[], snapTo?: HTMLElement, coordinates?: CursorPosition, activeItem?: number) {
    setTimeout(() => {
      setContextMenu(null);
      setContextMenu({ items, snapTo, coordinates, activeItem });
    }, 0);
  }

  function hideContextMenu() {
    setContextMenu(null);
  }

  useEffect(() => {
    setLocation("/uterni-oslava")
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{shoppingLists, setShoppingLists, activeUser, setActiveUser, contextMenu, setContextMenu, showContextMenu, hideContextMenu}}
      >
        <ContextMenuRenderer/>
        <Router>
            <Page>
                <LeftPanel/>
                <div>
                  <Switch>
                    <Route path="/:shoppingListName" component={ShoppingList}/>
                    <Route component={ErrorPage} />
                  </Switch>
                </div>
            </Page>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

const Page = styled("div")`
  display: flex;

  > div:last-of-type {
    width: 100%;
    margin-left: 350px;
    padding: 40px 40px 160px 40px;  
  }
`;

export default App;
