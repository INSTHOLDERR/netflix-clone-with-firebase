import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, removeFromWatchlist as removeMovieFromDB } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

// Create the context
const WatchlistContext = createContext();

// Provider component
export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist from Firebase
  const fetchWatchlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "watchlist"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const movies = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWatchlist(movies);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      toast.error("Failed to fetch watchlist!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [auth.currentUser]);

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId) => {
    try {
      await removeMovieFromDB(movieId);
      setWatchlist((prev) => prev.filter((movie) => movie.movieId !== movieId));
      toast.info("Removed from Watchlist!");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("Failed to remove from watchlist!");
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, setWatchlist, loading, removeFromWatchlist, fetchWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom hook to use context
export const useWatchlist = () => useContext(WatchlistContext);
