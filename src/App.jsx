import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import WatchlistPage from "./pages/WatchlistPage/WatchlistPage";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { currentUser } = useAuth();
  console.log("current user",currentUser);
  

  return (
    <div>
      <ToastContainer theme="dark" />

      <Routes>
      
        {currentUser ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
