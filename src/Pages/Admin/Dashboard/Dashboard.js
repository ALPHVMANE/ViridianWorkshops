import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './styles/Dashboard.css';
import { ref, onValue, remove } from 'firebase/database';
import { db, auth } from '../../../Config/Firebase'; // Ensure to import auth
import { deleteUser } from 'firebase/auth'; // Import deleteUser

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
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.value) {
        const [user] = users.filter(user => user.id === id);

        // Attempt to delete the user from Firebase Auth
        try {
          // Assuming that you have a way to get the user object from Firebase Auth
          const userCredential = await auth.currentUser; // Get the currently logged-in user
          if (userCredential) {
            await deleteUser(userCredential); // Delete the user from Firebase Auth
          }

          // Remove user from Firebase Realtime Database
          await remove(ref(db, 'users/' + id));

          // Update local state
          const usersCopy = users.filter(user => user.id !== id);
          setUsers(usersCopy);

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${user.first_name} ${user.last_name}'s data has been deleted.`,
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message,
            showConfirmButton: true,
          });
        }
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>;
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
