import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { api } from "./api";

export type UserType = {
    userId: string,
    username: string,
    email: string,
    roles: {
        [key:string]: boolean
    }
}


export type AuthType = {
    tokens: {
        authToken: string;
    },
    user: UserType
}

export const App = ({ children }: { children: React.ReactNode }) => {
    // const [authToken, setAuthToken] = useState<string | null>(null);
    const [auth, setAuth] = useState<AuthType | null>(null);

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
        // setAuthToken(() => data?.tokens.authToken);
        console.log('[User] ', data);
        setAuth(() => ({...data}))
        }
        catch(err: any) {
            console.error(err);
            // setAuthToken(null);
            setAuth(null);
        }   
    }, [auth]);

    // TODO: Add listener to refresh authToken
    useEffect(() => {
        loadUser();
        // return () => setAuthToken(null);
        return () => setAuth(null)
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authToken: auth?.tokens.authToken,
                user: auth?.user,
                updateAuth: (auth: AuthType | null) =>
                    auth && setAuth(auth),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
