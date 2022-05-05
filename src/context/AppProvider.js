window.navigator.userAgent = "react-native";
import React, { useEffect, useState } from 'react';

export const AppContext = React.createContext();

const AppProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)

    return <AppContext.Provider value={{ loading, setLoading }}>{children}</AppContext.Provider>;
};

export default AppProvider

