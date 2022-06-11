import { useAppBridge } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import UserSettingsContext from "./UserSettingsContext";
import { userLoggedInFetch } from "../App";

export const UserSettingsProvider = ({ children }) => {

    const [userSettings, setUserSettings] = useState(null);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    async function fetchSettings() {
        // this only works with the regular fetch
        /*const token = await getSessionToken(app);
        console.log("Token : " + token)
        const res = await fetch("/apps/settings", {
            headers: { Authorization: `Bearer ${token}` },
        }); */
        const res = await fetch("/apps/settings");
        const settings = await res.json();
        setUserSettings(settings);
    }

    async function updateSettings() {
        console.log("Update settings")
    }

    useEffect(() => {
        fetchSettings(app);
    },[])

    return (
        <UserSettingsContext.Provider value={{userSettings, updateSettings}}>
            { children }
        </UserSettingsContext.Provider>
    )
}