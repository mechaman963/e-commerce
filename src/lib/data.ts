export const usersTableHead: string[] = [
  "ID",
  "Name",
  "Email",
  "Role",
  "Actions",
];

export const categoriesTableHead: string[] = ["ID", "Name", "Image", "Actions"];

export const productsTableHead: string[] = [
  "ID",
  "Title",
  "Image",
  "Price",
  'Created',
  'Updated',
  "Category",
  "Actions",
];

export type TUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type TCategory = {
  id: number;
  title: string;
  image: string;
};

export type TProduct = {
  id: number;
  title: string;
  price: number;
  category: string;
  images: Array<{
    id: number;
    product_id: number;
    image: string;
    created_at: string;
    updated_at: string;
  }>;
  created_at: string
  updated_at:string
};
