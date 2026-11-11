import { createContext, useContext } from "react";

export const CartContext = createContext(null);

export const FREE_SHIPPING_FROM = 50; // mesma regra PHP como em orders.php
export const SHIPPING_COST = 4.99;

// Corta mato
export const useCart = () => useContext(CartContext);
