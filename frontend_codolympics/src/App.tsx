import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { api } from "./api";

export const App = ({ children }: { children: React.ReactNode }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);

    // const loadUser = async () => {
    //     try {
    //     const { data } = await api.post(
    //         "/api/v1/users/auth",
    //         {},
    //         {
    //             withCredentials: true,
    //         }
    //     );
    //     setAuthToken(() => data?.tokens.authToken);
    //     }
    //     catch(err: any) {
    //         console.error(err);
    //     }   
    // };

    const loadUser = useCallback(async () => {
        try {
        const { data } = await api.post(
            "/api/v1/users/auth",
            {},
            {
                withCredentials: true,
            }
        );
        setAuthToken(() => data?.tokens.authToken);
        }
        catch(err: any) {
            console.error(err);
        }   
    }, [])

    // TODO: Add listener to refresh authToken
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authToken,
                updateAuthToken: (authToken) =>
                    authToken && setAuthToken(authToken),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
