import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { firebaseAuth } from "@/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | undefined;
    loading: boolean;
    signin: (email: string, password: string) => Promise<unknown>;
    signup: (email: string, password: string) => Promise<unknown>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children:ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(firebaseAuth, (user) => {
            setCurrentUser(user || undefined);
            setLoading(false);
        })
    });

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            loading, 
            signin:(email: string, password: string) => signInWithEmailAndPassword(firebaseAuth, email, password), 
            signup: (email: string, password: string) => createUserWithEmailAndPassword(firebaseAuth, email, password), 
            logOut: () => signOut(firebaseAuth) 
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

