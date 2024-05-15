import { create } from 'zustand'
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase';

export const useUserStore = create((set) => ({
    currentUser:null,
    isLoading: true,
    fetchUserInfo: async (uid) => {
        if (!uid) {
            return set({ currentUser: null, isLoading: false });
        }
        
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set((state) => ({ ...state, currentUser: docSnap.data(), isLoading: false }));
                console.log("Document exists.");
            } else {
                set((state) => ({ ...state, currentUser: null, isLoading: false }));
                console.log("Document does not exist.");
            }
        } catch (error) {
            console.log(error);
            set({ currentUser: null, isLoading: false });
        }
    }
}));
