import React from 'react';

const Table = ({ users, handleEdit, handleDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>UserName</th>
          <th>Email</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            {/* <td>{user.firstName}</td> */}
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.date}</td>
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