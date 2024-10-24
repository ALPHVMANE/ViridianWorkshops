import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { auth, db } from '../../../Config/Firebase'; // Import your firebase config
import { updateEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const Edit = ({ users, selectedUser, setUsers, setIsEditing }) => { 
  const id = selectedUser.id;

  const [firstName] = useState(selectedUser.first_name); // Keep as state but do not allow editing
  const [lastName] = useState(selectedUser.last_name); // Keep as state but do not allow editing
  const [username, setUsername] = useState(selectedUser.username || ''); // Editable
  const [email, setEmail] = useState(selectedUser.email);
  const createdAt = selectedUser.createdAt ? new Date(selectedUser.createdAt).toISOString().slice(0, 10) : '';
  const [role, setRole] = useState(selectedUser.role || 'user'); // Default to 'user'

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!username || !email) { // Check only the editable fields
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const updatedUser = {
      id,
      username,
      first_name: firstName, // Keep original first name
      last_name: lastName, // Keep original last name
      email,
      createdAt, // Keep the original date
      role, // Include the role in the updated user object
    };

    try {
      // Update email in Firebase Auth if it has changed
      if (email !== selectedUser.email) {
        await updateEmail(auth.currentUser, email); // Make sure the user is logged in
      }

      // Update the user in the Firebase Realtime Database
      await set(ref(db, 'users/' + id), updatedUser);

      // Update the user in the users array
      const updatedUsers = users.map(user => (user.id === id ? updatedUser : user));

      localStorage.setItem('users_data', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setIsEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `${updatedUser.first_name} ${updatedUser.last_name}'s data has been updated.`,
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
    <div className="ae-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit User</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          value={username} // Bind username state
          onChange={e => setUsername(e.target.value)} // Update username state
          required // Make sure the username field is required
        />
        <label htmlFor="firstName">Designer First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName} // Keep the original first name
          readOnly // Make the first name field read-only
        />
        <label htmlFor="lastName">Designer Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName} // Keep the original last name
          readOnly // Make the last name field read-only
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required // Make sure the email field is required
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={createdAt} // Show the original date
          readOnly // Make the date field read-only
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
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;
