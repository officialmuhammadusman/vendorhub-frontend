import * as Yup from "yup";

export const vendorSetupSchema = Yup.object({
  storeName: Yup.string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name cannot exceed 50 characters")
    .required("Store name is required"),
  storeDescription: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  bankDetails: Yup.object({
    accountName:   Yup.string().optional(),
    accountNumber: Yup.string().optional(),
    bankName:      Yup.string().optional(),
  }),
});
