import { createContext, useContext } from "react";

const SettingsContext = createContext(null);
const useSettings = () => useContext(SettingsContext);

const SettingsProvider = ({value, children}) => {
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export {SettingsProvider, useSettings};