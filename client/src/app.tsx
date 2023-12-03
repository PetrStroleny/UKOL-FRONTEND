import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Route, Router, Switch } from "wouter";
import { ContextMenu, ContextMenuItem, ContextMenuRenderer, CursorPosition } from "./components/context-menu";
import LeftPanel from "./components/left-panel";
import HomePage from "./pages/index";
import ShoppingList from "./pages/shopping-list";
import { GlobalContext, Languague } from "./utils/contexts";
import { SWRConfig } from "swr";
import { getData, postData } from "./network";

function App() {
  const [showArchived, setShowArchived] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [activeUserToken, setActiveUserToken] = useState("$2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC");
  
  const [activeLanguage, setActiveLanguage] = useState(Languague.CZE);

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
        value={{ activeLanguage, setActiveLanguage, showArchived, setShowArchived, activeUserToken, setActiveUserToken, contextMenu, setContextMenu, showContextMenu, hideContextMenu}}
      >
        <ContextMenuRenderer/>
        <Router>
          <SWRConfig value={{fetcher: (url) => getData(url, activeUserToken)}}>
            <Page>
                <LeftPanel/>
                <div>
                  <Switch>
                    <Route path="/:shoppingListSlug" component={ShoppingList}/>
                    <Route component={HomePage} />
                  </Switch>
                </div>
            </Page>
          </SWRConfig>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

const Page = styled("div")`
  display: flex;

  > div:last-of-type {
    width: 100%;
    padding: 40px 40px 160px 40px;  

    @media screen and (min-width: ${p => p.theme.breakPoints.mobile}px) {
      margin-left: 320px;
    }
    @media screen and (max-width: ${p => p.theme.breakPoints.mobile}px) {
      margin-top: 55px;
    }
  }
`;

export default App;
