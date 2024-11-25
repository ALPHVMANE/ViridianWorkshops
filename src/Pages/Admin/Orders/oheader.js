import React from 'react';

const OrdersHeader = ({ setIsChecking, setIsAuthenticated }) => {
  return (
    <header>
      <h1 className="UsrMngSoftHeader">Order Management Dashboard</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button 
          className="UsrCreateBtn" 
          onClick={() => setIsChecking(true)}
        >
          Check Orphaned Orders
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
//             Orders are automatically created through Checkingout
//           </span>
//         </div>
//       </header>
//     );
//   };
