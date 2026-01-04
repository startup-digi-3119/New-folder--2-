import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword as firebaseUpdatePassword } from 'firebase/auth';

// Firebase configuration from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyDwAH2fhWL8Ntx2H8r4YgDsFxIlf5D2Udg",
    authDomain: "myplan-be94f.firebaseapp.com",
    projectId: "myplan-be94f",
    storageBucket: "myplan-be94f.firebasestorage.app",
    messagingSenderId: "697721057428",
    appId: "1:697721057428:web:889220fbd2b2f5197dc481",
    measurementId: "G-V8FRVX0V2E"
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
        },
        updatePassword: async (newPassword: string) => {
            if (!auth.currentUser) throw new Error('No user logged in');
            try {
                await firebaseUpdatePassword(auth.currentUser, newPassword);
                return { error: null };
            } catch (error: any) {
                return { error: { message: error.message } };
            }
        }
    }
};

export default firebase;
