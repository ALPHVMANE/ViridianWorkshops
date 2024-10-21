import { getDatabase, ref, get, child } from 'firebase/database';

// src/pages/ProfilePage.js
import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import Posts from '../components/Posts';

const ProfilePage = () => {
  const user = {
    username: 'john_doe',
    profilePicture: 'https://via.placeholder.com/150',
    bio: 'Just another Instagram user',
    postsCount: 42,
    followersCount: 150,
    followingCount: 180,
  };

  const posts = [
    { image: 'https://via.placeholder.com/300' },
    { image: 'https://via.placeholder.com/300' },
    { image: 'https://via.placeholder.com/300' },
    { image: 'https://via.placeholder.com/300' },
    { image: 'https://via.placeholder.com/300' },
    { image: 'https://via.placeholder.com/300' },
  ];

  return (
    <div className="profile-page">
      <ProfileHeader user={user} />
      <Posts posts={posts} />
    </div>
  );
};

export default ProfilePage;