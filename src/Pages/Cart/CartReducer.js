export const CartReducer = (state, action) => {
    const { shoppingCart, totalPrice, totalQty } = state;

    switch (action.type) {
        case 'ADD_TO_CART':
            const existingProduct = shoppingCart.find(item => item.ProdID === action.product.ProdID);
            
            if (existingProduct) {
                // Product exists, increment quantity
                const updatedCart = shoppingCart.map(item => 
                    item.ProdID === action.product.ProdID 
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
                
                return {
                    shoppingCart: updatedCart,
                    totalPrice: totalPrice + action.product.ProdPrice,
                    totalQty: totalQty + 1
                };
            } else {
                // New product
                return {
                    shoppingCart: [...shoppingCart, { ...action.product, qty: 1 }],
                    totalPrice: totalPrice + action.product.ProdPrice,
                    totalQty: totalQty + 1
                };
            }

        case 'REMOVE_FROM_CART':
            const filteredCart = shoppingCart.filter(item => item.ProdID !== action.productId);
            const removedItem = shoppingCart.find(item => item.ProdID === action.productId);
            
            return {
                shoppingCart: filteredCart,
                totalPrice: totalPrice - (removedItem.ProdPrice * removedItem.qty),
                totalQty: totalQty - removedItem.qty
            };

            case 'UPDATE_QTY':
                const updatedCart = shoppingCart.map(item =>
                    item.ProdID === action.productId
                        ? {
                            ...item,
                            qty: action.newQty
                        }
                        : item
                );
                
                return {
                    shoppingCart: updatedCart,  // You were returning the old shoppingCart
                    totalPrice: updatedCart.reduce((sum, item) => sum + (item.ProdPrice * item.qty), 0),
                    totalQty: updatedCart.reduce((sum, item) => sum + item.qty, 0)
                };

        case 'CLEAR_CART':
            return {
                shoppingCart: [],
                totalPrice: 0,
                totalQty: 0
            };

        default:
            return state;
    }
};