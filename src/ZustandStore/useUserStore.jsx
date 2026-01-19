// // import { create } from "zustand";
// // import { doc, getDoc } from "firebase/firestore";
// // import { db } from "../Database";

// // export const useUserStore = create((set) => ({
// //   currentuser: null,
// //   loading: true,
// //   fetchUserinfo: async (uid) => {
// //     if (!uid) return set({ currentuser: null, loading: false });
// //     try {
// //       const docRef = doc(db, "users", uid);
// //       const docSnap = await getDoc(docRef);

// //       if (docSnap.exists()) {
// //         set({ currentuser: docSnap.data(), loading: false });
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       return set({ currentuser: null, loading: false });
// //     }
// //   },
// // }));
// import { create } from "zustand";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../Database";

// export const useUserStore = create((set) => ({
//   currentuser: null,
//   loading: true,
//   fetchUserinfo: async (uid) => {
//     if (!uid) return set({ currentuser: null, loading: false });
//     try {
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         set({ currentuser: docSnap.data(), loading: false });
//       }
//     } catch (err) {
//       console.log(err);
//       return set({ currentuser: null, loading: false });
//     }
//   },
// }));

import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Database";

export const useUserStore = create((set) => ({
  currentuser: null,
  loading: true,
  fetchUserinfo: async (uid) => {
    // Jodi uid na thake, loading false kore return korbe
    if (!uid) return set({ currentuser: null, loading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // User data-r sathe id-tao store korchi safety-r jonno
        set({
          currentuser: { ...docSnap.data(), id: docSnap.id },
          loading: false,
        });
      } else {
        // Jodi user na paowa jay
        set({ currentuser: null, loading: false });
      }
    } catch (err) {
      console.log("Error fetching user info:", err);
      return set({ currentuser: null, loading: false });
    }
  },
}));
