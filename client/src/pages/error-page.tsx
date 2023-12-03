import { useContext } from "react";
import { GlobalContext, getTextAfterLanguage } from "../utils/contexts";

const ErrorPage = () => {
    const { activeLanguage } = useContext(GlobalContext);

    return (
        <>
            404 : {getTextAfterLanguage("Stránka nebyla nalezena", "Page not found", activeLanguage)}
        </>
    );
}


export default ErrorPage;