import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { auth, db } from '../../../Config/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import './styles/AddEdit.css';

const Add = ({ users, setUsers, setIsAdding }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); // New state for username
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [role, setRole] = useState('user'); // Default role

  const handleAdd = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if ( !username || !firstName || !lastName|| !email || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'qwerty77'); //DEFAULT PASSWORD
      const userId = userCredential.user.uid; // Get the user's unique ID

      // Prepare user data
      const newUser = {
        id: userId,
        username, 
        first_name: firstName,
        last_name: lastName,// Include username in the new user object
        email,
        createdAt: new Date().toISOString(), // Use a standard format for dates
        role,
      };

      // Save user data to Firebase Realtime Database
      await set(ref(db, 'users/' + userId), newUser);

      // Optionally, store locally
      users.push(newUser);
      localStorage.setItem('users_data', JSON.stringify(users)); // Store in local storage
      setUsers(users);
      setIsAdding(false);

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: `${firstName} ${lastName}'s data has been added.`,
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
  };

  return (
    <div className="ae-container ">
      <form onSubmit={handleAdd}>
        <h1>Add User</h1>
        <label htmlFor="username">Username</label> {/* New label for username */}
        <input
          id="username"
          type="text"
          name="username"
          value={username} // Bind username state
          onChange={e => setUsername(e.target.value)} // Update username state
        />
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={e => setRole(e.target.value)} // Set the selected role
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="designer">Designer</option>
          <option value="technician">Technician</option>
          <option value="driver">Driver</option>
        </select>
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
