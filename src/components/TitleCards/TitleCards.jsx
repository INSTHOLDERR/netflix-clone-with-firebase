import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { auth, addToWatchlist, removeFromWatchlist, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./TitleCards.css";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const cardsRef = useRef();
  const navigate = useNavigate();

  const TMDB_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTM1ODY5ODJkNDhjOWE0NGNmZDRkNWU3MTI0YzQ0MyIsIm5iZiI6MTc1OTYwOTUyNy44NDA5OTk4LCJzdWIiOiI2OGUxODJiN2ZlYWJhNzE2YTlmODEyZDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hxbXNQxpeqDaB_S64o2rUlXCW1EGnJAJJvWaYIDuWTw";

  const handleWheel = (e) => {
    e.preventDefault();
    cardsRef.current.scrollLeft += e.deltaY;
  };

  // Fetch movies from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${category || "now_playing"}?language=en-US&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          }
        );
        setApiData(res.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("❌ Failed to load movies!");
      }
    };

    fetchMovies();
    const currentRef = cardsRef.current;
    currentRef.addEventListener("wheel", handleWheel);
    return () => currentRef.removeEventListener("wheel", handleWheel);
  }, [category]);

  // Fetch user's watchlist from Firebase
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, "watchlist"),
          where("uid", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const ids = snapshot.docs.map((doc) => doc.data().movieId);
        setWatchlistIds(ids);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };
    fetchWatchlist();
  }, [auth.currentUser]);

  // Toggle add/remove watchlist
  const handleWatchlist = async (movie) => {
    if (!auth.currentUser) {
      toast.info("Please login to manage your watchlist!");
      return;
    }

    try {
      if (watchlistIds.includes(movie.id)) {
        await removeFromWatchlist(movie.id);
        setWatchlistIds(watchlistIds.filter((id) => id !== movie.id));
      } else {
        await addToWatchlist(movie);
        setWatchlistIds([...watchlistIds, movie.id]);
      }
    } catch (error) {
      console.error("Watchlist Toggle Error:", error);
      toast.error("❌ Failed to update watchlist!");
    }
  };

  const handlePlay = (id) => {
    navigate(`/player/${id}`);
  };

  return (
    <div className="title-cards">
      <h2>{title || "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((movie) => (
          <div className="card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
              alt={movie.original_title}
              onClick={() => handlePlay(movie.id)}
            />
            <div className="card-overlay">
              <p>{movie.original_title}</p>
              <div className="card-buttons">
                <button
                  className="btn play-btn"
                  onClick={() => handlePlay(movie.id)}
                >
                  Play
                </button>
                <button
                  className="btn watchlist-btn"
                  onClick={() => handleWatchlist(movie)}
                >
                  {watchlistIds.includes(movie.id) ? "Added" : "+ Watchlist"}
                </button>
              </div>
            </div>
             <p className="card-title">{movie.original_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
