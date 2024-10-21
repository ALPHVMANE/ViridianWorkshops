import React from 'react';
import './Posts.css'; // Create this CSS file for styling

const Posts = ({ posts }) => {
  return (
    <div className="posts-grid">
      {posts.map((post, index) => (
        <div key={index} className="post">
          <img src={post.image} alt={`Post ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Posts;