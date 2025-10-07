// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, addDoc, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx__yDx6CFERUAZa1sPiecR16mh9-8Xaw",
  authDomain: "netflix-clone-b5177.firebaseapp.com",
  projectId: "netflix-clone-b5177",
  storageBucket: "netflix-clone-b5177.firebasestorage.app",
  messagingSenderId: "562924102693",
  appId: "1:562924102693:web:8a1c3cdd72b0a621134bcc",
  measurementId: "G-600CG79ZW4",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Sign Up function
const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      email,
      authProvider: "local",
      createdAt: new Date(),
    });

    toast.success("🎉 User signed up successfully!");
    console.log("User signed up successfully!");
  } catch (error) {
    console.error("Signup Error:", error);
    toast.error(`❌ ${error.message}`);
  }
};

// ✅ Login function
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("✅ User logged in successfully!");
    console.log("User logged in successfully!");
  } catch (error) {
    console.error("Login Error:", error);
    toast.error(`❌ ${error.message}`);
  }
};

// ✅ Logout function
const logout = async () => {
  try {
    await signOut(auth);
    toast.info("👋 User logged out!");
    console.log("User logged out!");
  } catch (error) {
    console.error("Logout Error:", error);
    toast.error(`❌ ${error.message}`);
  }
};

// ✅ Add movie to watchlist
const addToWatchlist = async (movie) => {
  if (!auth.currentUser) {
    toast.info("Please login to add to your watchlist!");
    return;
  }

  try {
    await addDoc(collection(db, "watchlist"), {
      uid: auth.currentUser.uid,
      movieId: movie.id,
      title: movie.original_title,
      backdrop_path: movie.backdrop_path,
      createdAt: new Date(),
    });

    toast.success(`✅ "${movie.original_title}" added to watchlist!`);
  } catch (error) {
    console.error("Watchlist Error:", error);
    toast.error("❌ Failed to add to watchlist!");
  }
};

// ✅ Remove movie from watchlist
const removeFromWatchlist = async (movieId) => {
  if (!auth.currentUser) return;

  try {
    const q = query(
      collection(db, "watchlist"),
      where("uid", "==", auth.currentUser.uid),
      where("movieId", "==", movieId)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "watchlist", docSnap.id));
    });

    toast.info("🗑️ Removed from watchlist!");
  } catch (error) {
    console.error("Remove Watchlist Error:", error);
    toast.error("❌ Failed to remove from watchlist!");
  }
};

export { auth, db, signup, login, logout, addToWatchlist, removeFromWatchlist };
