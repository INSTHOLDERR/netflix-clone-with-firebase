import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { auth, addToWatchlist, removeFromWatchlist, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState(null);
  const [videoKey, setVideoKey] = useState('');
  const [watchlistIds, setWatchlistIds] = useState([]);

  const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTM1ODY5ODJkNDhjOWE0NGNmZDRkNWU3MTI0YzQ0MyIsIm5iZiI6MTc1OTYwOTUyNy44NDA5OTk4LCJzdWIiOiI2OGUxODJiN2ZlYWJhNzE2YTlmODEyZDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hxbXNQxpeqDaB_S64o2rUlXCW1EGnJAJJvWaYIDuWTw";

  const axiosOptions = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, axiosOptions);
        setMovieData(res.data);
      } catch (err) {
        console.error(err);
        toast.error('❌ Failed to load movie details');
      }
    };

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, axiosOptions);
        const trailer = res.data.results.find(v => v.type === 'Trailer');
        if (trailer) setVideoKey(trailer.key);
      } catch (err) {
        console.error(err);
        toast.error('❌ Failed to load trailer');
      }
    };

    fetchMovie();
    fetchVideo();
  }, [id]);

  // Fetch user's watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'watchlist'), where('uid', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const ids = snapshot.docs.map(doc => doc.data().movieId);
        setWatchlistIds(ids);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWatchlist();
  }, [auth.currentUser]);

  // Add/remove watchlist
  const handleWatchlist = async () => {
    if (!auth.currentUser) {
      toast.info('Please login to manage your watchlist!');
      return;
    }

    try {
      if (watchlistIds.includes(Number(id))) {
        await removeFromWatchlist(Number(id));
        setWatchlistIds(watchlistIds.filter(i => i !== Number(id)));
        // toast.info('Removed from watchlist');
      } else {
        await addToWatchlist(movieData);
        setWatchlistIds([...watchlistIds, Number(id)]);
        // toast.success('Added to watchlist');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update watchlist');
    }
  };

  return (
    <div className="player-page">
      <img src={back_arrow_icon} alt="Back" onClick={() => navigate(-1)} className="back-arrow" />

      {videoKey && (
        <iframe
          width="90%"
          height="480px"
          src={`https://www.youtube.com/embed/${videoKey}`}
          title={movieData?.title || 'trailer'}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}

      {movieData && (
        <div className="player-info">
          <h2>{movieData.title}</h2>
          <p>Release: {movieData.release_date}</p>
          <p>Rating: {movieData.vote_average}</p>
          <button className="btn watchlist-btn" onClick={handleWatchlist}>
            {watchlistIds.includes(Number(id)) ? 'Added' : '+ Watchlist'}
          </button>
        </div>
      )}

      <div className="recommendations">
        <h3>Recommended</h3>
        <TitleCards category="popular" title="Popular Movies" />
      </div>
         <Footer/>
    </div>
  );
};

export default Player;
