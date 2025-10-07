import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import WatchlistCard from "../../components/WatchlistCard/WatchlistCard";
import "./WatchlistPage.css";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [visibleRows, setVisibleRows] = useState(5); 
  const itemsPerRow = 6;

  useEffect(() => {
    const fetchWatchlist = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "watchlist"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const movies = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWatchlist(movies);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, []);

  const visibleMovies = watchlist.slice(0, visibleRows * itemsPerRow);

  const handleShowMore = () => {
    setVisibleRows((prev) => prev + 1);
  };

  return (
    <div className="watchlist-page">
      <Navbar />
      <h1 className="watchlist-title">My Watchlist</h1>

      {visibleMovies.length === 0 ? (
        <p className="empty-text">Your watchlist is empty.</p>
      ) : (
        <div className="watchlist-grid">
          {visibleMovies.map((movie) => (
            <WatchlistCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {visibleMovies.length < watchlist.length && (
        <div className="show-more-container">
          <button onClick={handleShowMore} className="show-more-btn">
            Show More
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WatchlistPage;
