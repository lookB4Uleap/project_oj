import { createContext } from "react";
import { AuthType, UserType } from "../App";

type AuthContextType = {
    authToken?: string|null;
    user?: UserType | null;
    // updateAuthToken: (authToken?: string|null) => void;
    updateAuth: (auth: AuthType| null) => void;
} 

export const AuthContext = createContext<AuthContextType>({
    authToken: null,
    user: null,
    // updateAuthToken: (_?: string|null) => {}
    updateAuth: (_: AuthType| null) => {}
});