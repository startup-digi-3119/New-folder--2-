import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyBrEEusvxRt1Zcq6BZaiWqHMpp6fZhMhiI",
    authDomain: "myplan-be94f.firebaseapp.com",
    projectId: "myplan-be94f",
    storageBucket: "myplan-be94f.firebasestorage.app",
    messagingSenderId: "697721057428",
    appId: "1:697721057428:android:8a73bea16a3c378c7dc481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Export auth functions with Supabase-compatible interface
export const firebase = {
    auth: {
        signUp: async ({ email, password }: { email: string; password: string }) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                return {
                    data: { user: userCredential.user },
                    error: null
                };
            } catch (error: any) {
                return {
                    data: { user: null },
                    error: { message: error.message }
                };
            }
        },
        signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                return {
                    data: { user: userCredential.user },
                    error: null
                };
            } catch (error: any) {
                return {
                    data: { user: null },
                    error: { message: error.message }
                };
            }
        },
        signOut: async () => {
            try {
                await signOut(auth);
                return { error: null };
            } catch (error: any) {
                return { error: { message: error.message } };
            }
        },
        getSession: async () => {
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    resolve({
                        data: { session: user ? { user } : null },
                        error: null
                    });
                });
            });
        },
        onAuthStateChange: (callback: (event: string, session: any) => void) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                callback('SIGNED_IN', user ? { user } : null);
            });

            return {
                data: {
                    subscription: {
                        unsubscribe
                    }
                }
            };
        }
    }
};

export default firebase;
