import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebase } from '../services/firebase';
// Define a generic user type for components that expect Supabase shape
interface User {
    id: string;
    email?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for active session
        firebase.auth.getSession().then(({ data: { session } }: any) => {
            if (session?.user) {
                // Map uid to id for compatibility
                (session.user as any).id = session.user.uid;
                setUser(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = firebase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session?.user) {
                // Map uid to id for compatibility
                (session.user as any).id = session.user.uid;
                setUser(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await firebase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
