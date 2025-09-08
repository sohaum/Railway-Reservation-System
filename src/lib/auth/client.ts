'use client';
//import type { Admin } from '@/types/admin';
import type { User } from '@/types/user';
import type { Train } from '@/types/train';
import { redirect } from 'next/navigation';
import { auth, db} from '@/lib/firebase';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { doc, setDoc,getDoc } from "firebase/firestore"; 


// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  name: {
  firstName: 'Sofia',
  lastName: 'Rivers',
  },
  email: 'sofia@devias.io',
} satisfies User;

// const admin = {
//   id: 'ADMN-000',
//   avatar: '/assets/avatar1.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// } satisfies Admin;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  user: User = {
    id: '',
    avatar: '',
    name : {
      firstName: '',
      lastName: '',
    },
    email: '',
    token: '',
  };

  // NEW (matches current Train interface)
  train: Train = {
    trainNo: '',
    trainName: '',
    fromCity: '',
    toCity: '',
    trainType: '',
    frequency: '',
    departureDateTime: '',
    destinationDateTime: '',
    totalSeats: 0,
    classes: [],              // ✅ New class-based structure
  };

  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { firstName, lastName, email, password } = params;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
  
      if (!newUser) {
        return { error: "Couldn't create user" };
      }
  
      const idTokenResult = await newUser.getIdTokenResult();
      const uid = newUser.uid;
  
      await setDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        email,
        id: uid,
        token: idTokenResult.token,
      });
  
      return {};
    } catch (e: any) {
      return { error: e.message || "Signup failed" };
    }
  }
  
  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
  
      if (!newUser) {
        return { error: 'Invalid credentials' };
      }
  
      // Get Firestore profile
      const docRef = doc(db, 'users', newUser.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        return { error: 'User profile not found in Firestore' };
      }
  
      const token = await newUser.getIdToken();
      localStorage.setItem('custom-auth-token', token);
  
      return {}; // success
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        return { error: 'Wrong password' };
      }
      if (error.code === 'auth/user-not-found') {
        return { error: 'No user found with this email' };
      }
      return { error: error.message };
    }
  }

  async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
    const { email } = params;
  
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://railway-reservation-fbd5c.web.app/auth/reset-password-confirm", // must be whitelisted in Firebase Console
        handleCodeInApp: true,
      });
      return {};
    } catch (error: any) {
      return { error: error.message || "Failed to send reset email" };
    }
  }

  async confirmResetPassword(oobCode: string, newPassword: string): Promise<{ error?: string }> {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return {};
    } catch (error: any) {
      return { error: error.message || "Failed to reset password" };
    }
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    await signOut(auth);
    localStorage.removeItem('custom-auth-token');
    // user = undefined;

    return {};
  }
   
  // signOut(auth).then(() => {
  //   // Sign-out successful.
  // }).catch((error) => {
  //   // An error happened.
  // });

  // async signOut(auth: firebase.auth.Auth): Promise<{ error?: string }> {
  //   try {
  //     // Remove the custom auth token from local storage
  //     localStorage.removeItem('custom-auth-token');
  
  //     // Sign out from Firebase auth
  //     await auth.signOut();
  
  //     // Sign-out successful
  //     return {};
  //   } catch (error) {
  //     // An error happened
  //     return { error: error.message };
  //   }
  // }

}

export const authClient = new AuthClient();
