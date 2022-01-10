import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from "../services/api";
import  Router, { useRouter } from 'next/router'

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

export function signOut(){
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')
    
    Router.push('/')
}

export function AuthProvider({ children }: ProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()
        if (token) {
            api.get('/me')
                .then(response => {
                    const { email, permissions, roles } = response.data
                    setUser({
                        email,
                        permissions,
                        roles,
                    })

                }).catch(() => {
                    signOut()
                })
        }
    }, [])

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password,
            })
            const { token, refreshToken, permissions, roles } = response.data;

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',

            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',

            })

            setUser({
                email,
                permissions,
                roles,
            });

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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