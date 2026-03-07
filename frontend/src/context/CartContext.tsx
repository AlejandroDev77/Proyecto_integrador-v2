import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id_mue: number;
  nom_mue: string;
  img_mue?: string;
  precio_venta: number;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "carrito_muebles";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        console.error("Error loading cart from storage");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "cantidad">) => {
    setItems((current) => {
      const existing = current.find((i) => i.id_mue === item.id_mue);
      if (existing) {
        return current.map((i) =>
          i.id_mue === item.id_mue ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...current, { ...item, cantidad: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((i) => i.id_mue !== id));
  };

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad < 1) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.id_mue === id ? { ...i, cantidad } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.precio_venta * i.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
