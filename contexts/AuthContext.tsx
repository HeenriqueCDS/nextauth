import { createContext, ReactNode, useState } from "react";
import {setCookie} from 'nookies'
import { api } from "../services/api";
import { useRouter } from 'next/router'

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    user: User | undefined;
    isAuthenticated: boolean;
};

type ProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: ProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password,
            })
            const { token, refreshToken, permissions, roles} = response.data;

            setCookie(undefined, 'nextauth.token', token)
            setCookie(undefined, 'nextauth.refreshToken', token)

             setUser({
                email,
                permissions,
                roles,
            })
            router.push('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
            {children}
        </AuthContext.Provider>
    )
}