import React from 'react';

const Table = ({ users, handleEdit, handleDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.first_name || 'N/A'}</td> {/* Default to 'N/A' if missing */}
            <td>{user.last_name || 'N/A'}</td> {/* Default to 'N/A' if missing */}
            <td>{user.username || 'N/A'}</td> {/* Default to 'N/A' if missing */}
            <td>{user.email || 'N/A'}</td> {/* Default to 'N/A' if missing */}
            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td> {/* Format date, default to 'N/A' */}
            <td>
              <button onClick={() => handleEdit(user.id)} className="button muted-button">Edit</button>
              <button onClick={() => handleDelete(user.id)} className="button muted-button">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
