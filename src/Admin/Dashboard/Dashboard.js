import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import {db} from '../../Firebase'


import { usersData } from '../../Database/usersData';

const Dashboard = ({ setIsAuthenticated }) => {
  const [users, setUsers] = useState([]);

  const [selectedUser, setselectedUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

 useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => doc.data());
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleEdit = id => {
    const [user] = users.filter(user => user.id === id);

    setselectedUser(user);
    setIsEditing(true);
  };

  const handleDelete = async id => {
    try {
      const [user] = users.filter(user => user.id === id);
  
      const docRef = doc(db, 'users', id);
      await deleteDoc(docRef);
  
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `${user.firstName} ${user.lastName}'s data has been deleted.`,
        showConfirmButton: false,
        timer: 1500,
      });
  
      const usersCopy = users.filter(user => user.id !== id);
      setUsers(usersCopy);
    } catch (error) {
      console.error('Error deleting user: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error while deleting the user. Please try again later.',
      });
    }
  };
  
  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            users={users}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
      {isAdding && (
        <Add
          users={users}
          setUsers={setUsers}
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          users={users}
          selectedUser={selectedUser}
          setUsers={setUsers}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;