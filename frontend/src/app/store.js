import { configureStore } from '@reduxjs/toolkit'
import CartReducer from "../features/cartSlice/cartSlice.js"
export const store = configureStore({
    reducer: {
        Cart: CartReducer,
    },
})