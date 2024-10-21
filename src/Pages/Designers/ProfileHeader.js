import React from 'react';
import './styles/ProfileHeader.css'; 
const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header">
      <img src={user.profilePicture} alt="Profile" className="profile-picture" />
      <div className="profile-info">
        <h2 className="username">{user.username}</h2>
        <p className="bio">{user.bio}</p>
        <div className="stats">
          <span><strong>{user.postsCount}</strong> Posts</span>
          <span><strong>{user.followersCount}</strong> Followers</span>
          <span><strong>{user.followingCount}</strong> Following</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;