import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './styles/Dashboard.css';
import { ref, onValue, remove, get } from 'firebase/database';
import {auth, db} from '../../../Config/Firebase'; // Ensure to import auth

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

const Dashboard = ({ setIsAuthenticated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, 'users');

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(usersArray);
      }
      setLoading(false);
    });

    return () => {
      setUsers([]);
    };
  }, []);

  const handleEdit = id => {
    const [user] = users.filter(user => user.id === id);
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('You must be logged in to delete users');
      }
  
      // Get current user's role from database
      const currentUserRef = ref(db, `users/${currentUser.uid}`);
      const snapshot = await get(currentUserRef);
      
      if (!snapshot.exists() || snapshot.val().role !== 'admin') {
        throw new Error('Only admins can delete users');
      }
  
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });
  
      if (result.isConfirmed) {
        const userToDelete = users.find(user => user.id === id);
        
        if (!userToDelete) {
          throw new Error('User not found');
        }
  
        // Delete from Realtime Database
        const deleteRef = ref(db, `users/${id}`);
        await remove(deleteRef);
  
        // Delete from Authentication (this should be done on the server-side)
        // You'll need to create a server endpoint for this
        await fetch('/api/deleteUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: id })
        });
  
        // Update local state
        setUsers(users.filter(user => user.id !== id));
  
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${userToDelete.first_name} ${userToDelete.last_name}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  if (loading) {
    return <p>...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {!isAdding && !isEditing && (
          <>
            <Header
              setIsAdding={setIsAdding}
              setIsAuthenticated={setIsAuthenticated}
            />
            <Table
              users={users || []}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </>
        )}
        {isAdding && (
          <Add
            users={users || []}
            setUsers={setUsers}
            setIsAdding={setIsAdding}
          />
        )}
        {isEditing && (
          <Edit
            users={users || []}
            selectedUser={selectedUser}
            setUsers={setUsers}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
