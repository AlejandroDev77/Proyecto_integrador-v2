export type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  modelo_3d: string;
};

export type PlacedItem = {
  id: string;
  product: Product;
  x: number;
  z: number;
  scale: number;
  rotation: number;
};

export type ViewMode = "isometric" | "top" | "sideFront" | "sideLeft" | "sideRight" | "sideBack";
