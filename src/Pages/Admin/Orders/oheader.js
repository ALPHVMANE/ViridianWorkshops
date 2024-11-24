import React from 'react';

const OrdersHeader = ({ setIsAdding, setIsAuthenticated }) => {
  return (
    <header>
      <h1 className="OrdersMngHeader">Orders Management Dashboard</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button className="OrderCreateBtn" onClick={() => setIsAdding(true)}>
          Orphaned Transaction Check
        </button>
      </div>
    </header>
  );
};
export default OrdersHeader;

// const OrdersHeader = () => {
//     return (
//       <header>
//         <h1 className="OrderMngHeader">Orders Management Dashboard</h1>
//         <div style={{ marginTop: '30px', marginBottom: '18px' }}>
//           <span className="OrderInfoText">
//             Orders are automatically created through checkout
//           </span>
//         </div>
//       </header>
//     );
//   };
