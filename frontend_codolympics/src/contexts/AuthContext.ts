import { createContext } from "react";

type AuthContextType = {
    authToken: string|null;
    updateAuthToken: (authToken: string) => void;
} 

export const AuthContext = createContext<AuthContextType>({
    authToken: null,
    updateAuthToken: (_: string) => {}
});