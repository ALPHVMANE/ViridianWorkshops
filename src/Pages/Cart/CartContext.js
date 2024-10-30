// CartContext.js
import React, { createContext, useReducer } from 'react';
import { CartReducer } from './CartReducer';  // Add this import

export const CartContext = createContext();

export const CartContextProvider = (props) => {
    const [cart, dispatch] = useReducer(CartReducer, {
        shoppingCart: [],
        totalPrice: 0,
        totalQty: 0  // Add the initial value here
    });

    return (
        <CartContext.Provider value={{ ...cart, dispatch }}>
            {props.children}
        </CartContext.Provider>
    );
};

// import React, { createContext, useReducer } from 'react';
// import { CartReducer } from './CartReducer';

// export const CartContext = createContext();

// export const CartContextProvider = ({ children }) => {
//     const [cart, dispatch] = useReducer(CartReducer, {
//         shoppingCart: [],
//         totalPrice: 0,
//         totalQty: 0
//     });

//     return (
//         <CartContext.Provider value={{ ...cart, dispatch }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
