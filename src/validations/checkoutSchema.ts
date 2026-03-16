import * as Yup from "yup";

export const checkoutSchema = Yup.object({
  fullName:   Yup.string().required("Full name is required"),
  phone:      Yup.string().required("Phone number is required"),
  address:    Yup.string().required("Address is required"),
  city:       Yup.string().required("City is required"),
  state:      Yup.string().required("State is required"),
  postalCode: Yup.string().required("Postal code is required"),
  country:    Yup.string().required("Country is required"),
});
