
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { createContext, useContext, useEffect } from 'react';
import { toUserFirestore } from '../utils/utils';

type AuthContextType = {
    isSignedIn: boolean;
    user?: FirebaseAuthTypes.User;
    register: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const defaultAuthState: AuthContextType = {
    isSignedIn: true,
    register: async () => undefined,
    signIn: async () => undefined,
    signOut: async () => undefined,
}

const AuthContext = createContext<AuthContextType>(defaultAuthState)

export const AuthContextProvider: React.FC = ({ children }) => {

    const [auth, setAuth] = React.useState<{ user?: FirebaseAuthTypes.User; isSignedIn: boolean }>({
        isSignedIn: false,
    })

    const usersCollection = firestore().collection('users')

    useEffect(() => {
        console.log("useEffect")
        const unsubscribe = firebaseAuth().onAuthStateChanged((_user) => {
            console.log("onAuthStateChanged: ", _user)
            if (_user) {
                // user is logged in
                setAuth({
                    user: _user,
                    isSignedIn: true
                })
            } else {
                // user is logged out
                setAuth({
                    user: undefined,
                    isSignedIn: false
                })
            }
        })

        return unsubscribe
    }, [])


    const register = async (email: string, password: string) => {
        const register = await firebaseAuth().createUserWithEmailAndPassword(email, password)
        usersCollection.doc(register.user.uid).get()
            .then(documentSnapshot => {
                if (!documentSnapshot.exists) {
                    usersCollection.doc(register.user.uid).set({ uid: register.user.uid, username: register.user.email })
                }
            })
    }

    const signIn = async (email: string, password: string) => {
        const signIn = await firebaseAuth().signInWithEmailAndPassword(email, password)
        usersCollection.doc(signIn.user.uid).get()
            .then(documentSnapshot => {
                if (!documentSnapshot.exists) {
                    usersCollection.doc(signIn.user.uid).set({ uid: signIn.user.uid, username: signIn.user.email })
                }
            })
    }

    const signOut = async () => {
        await firebaseAuth().signOut()
    }

    return (
        <AuthContext.Provider
            value={{
                isSignedIn: auth.isSignedIn,
                user: auth.user,
                register,
                signIn,
                signOut
            }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}