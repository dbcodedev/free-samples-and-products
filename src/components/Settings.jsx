import useUserSettingsProvider from "../context/useUserSettingsContext";

export function Settings() {

    const { userSettings, setUserSettings } = useUserSettingsProvider();

    return (
        <div>{ "->" + userSettings.maxProductsByUser }</div>
    )
}