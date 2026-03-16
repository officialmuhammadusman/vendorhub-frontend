import * as Yup from "yup";

export const productSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Product title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  price: Yup.number()
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  discountPrice: Yup.number()
    .min(0, "Discount price cannot be negative")
    .optional(),
  category: Yup.string().required("Category is required"),
  stock: Yup.number()
    .min(0, "Stock cannot be negative")
    .integer("Stock must be a whole number")
    .required("Stock is required"),
  tags: Yup.string().optional(),
});
