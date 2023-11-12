import styled from "@emotion/styled";
import { useState } from "react";
import { Route, Router, Switch } from "wouter";
import { ContextMenu, ContextMenuItem, ContextMenuRenderer, CursorPosition } from "./components/context-menu";
import LeftPanel from "./components/left-panel";
import HomePage from "./pages/index";
import ShoppingList from "./pages/shopping-list";
import { GlobalContext, ShoppingListType, UserType } from "./utils/contexts";

function App() {

  const [showArchived, setShowArchived] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [activeUser, setActiveUser] = useState<UserType>(UserType.OWNER);
  const [shoppingLists, setShoppingLists] = useState<ShoppingListType[]>([
    {label: "Pondělní oslava", href: "pondelni-oslava", archived: false},
    {label: "Úterní oslava", href: "uterni-oslava", archived: true},
    {label: "Středeční pivo", href: "stredecni-pivo", archived: true},
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

  return (
    <>
      <GlobalContext.Provider
        value={{ showArchived, setShowArchived, shoppingLists, setShoppingLists, activeUser, setActiveUser, contextMenu, setContextMenu, showContextMenu, hideContextMenu}}
      >
        <ContextMenuRenderer/>
        <Router>
            <Page>
                <LeftPanel/>
                <div>
                  <Switch>
                    <Route path="/:shoppingListHref" component={ShoppingList}/>
                    <Route component={HomePage} />
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
    margin-left: 320px;
    padding: 40px 40px 160px 40px;  
  }
`;

export default App;
