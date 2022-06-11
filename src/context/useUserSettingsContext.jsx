import { useContext } from "react";
import UserSettingsContext from "./UserSettingsContext";

const useUserSettingsContext = () => {
    const settings = useContext(UserSettingsContext);

    if (settings === undefined) {
        throw new Error("useUserSettingsContext can only be used inside UserSettingsProvider");
    }

    return settings;
}

export default useUserSettingsContext;