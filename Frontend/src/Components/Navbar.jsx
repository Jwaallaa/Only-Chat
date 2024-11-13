import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';

const Navbar = ({ setUsersearch, setSearch, setLoading, searchbox, setsearchbox }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Debounced search effect
  useEffect(() => {
    if (searchbox.trim() === '') return;
    const timeoutId = setTimeout(() => searchHandler(), 500);
    return () => clearTimeout(timeoutId);
  }, [searchbox]);

  const searchHandler = async () => {
    const token = userInfo.token;
    if (!searchbox) return;
    setIsSearching(true);
    try {
      const responce = await axios.get(`https://only-chat.onrender.com/api/user/${searchbox}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(true);
      console.log(responce.data);
      setUsersearch(responce.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setUserDetails(userInfo);
    setShowModal(true);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('chats');

    navigate('/Only-Chat');
  };

  const closeModal = () => setShowModal(false);

  return (
    <nav>
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search user"
            onClick={() => setSearch(true)}
            onChange={(e) => setsearchbox(e.target.value)}
            value={searchbox}
            aria-label="Search User"
          />
          <button className="searchbtn" type="submit" disabled={isSearching}>
            {isSearching ? <div className="spinner-mini"></div> : 'Search'}
          </button>
        </form>
      </div>

      {userInfo && (
        <div className="profile">
          <h3 onClick={handleProfileClick}>{userInfo?.username}</h3>
          <button onClick={logout}>Logout</button>
        </div>
      )}

      {showModal && <Modal user={userDetails} onClose={closeModal} />}
    </nav>
  );
};

export default Navbar;
