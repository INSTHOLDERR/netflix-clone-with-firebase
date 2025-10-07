import React from "react";
import { useNavigate } from "react-router-dom";
import { removeFromWatchlist } from "../../firebase";
import "./WatchlistCard.css";

const WatchlistCard = ({ movie }) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/player/${movie.movieId}`);
  };

  const handleRemove = async () => {
    await removeFromWatchlist(movie.movieId);
    window.location.reload();
  };

  return (
    <div className="watchlist-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
        alt={movie.title}
        onClick={handlePlay}
      />
      <div className="watchlist-card-info">
        <h3>{movie.title}</h3>
        <button className="remove-btn" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default WatchlistCard;
