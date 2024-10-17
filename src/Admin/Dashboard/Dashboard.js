import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './dashboard.css';
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database functions
import { db } from '../../Config/Firebase'; // Import your Firebase database configuration

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

const Dashboard = ({ setIsAuthenticated }) => {
  const [users, setUsers] = useState([]); // State to hold the user data from Firebase
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    // Reference to the 'users' node in the Realtime Database
    const usersRef = ref(db, 'users');

    // Fetch users from Firebase Realtime Database
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

    // Clean up the listener when the component unmounts
    return () => {
      setUsers([]);
    };
  }, []); // Empty dependency array to run only once on mount

  const handleEdit = id => {
    const [user] = users.filter(user => user.id === id);
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        const [user] = users.filter(user => user.id === id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${user.firstName} ${user.lastName}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const usersCopy = users.filter(user => user.id !== id);
        setUsers(usersCopy);
        // Optionally, you can also remove the user from the Firebase database.
        // const userRef = ref(db2, `users/${id}`);
        // remove(userRef);
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading while fetching data
  }

  

  return (
    <div className="dashboard-container">
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
  );
};

export default Dashboard;
