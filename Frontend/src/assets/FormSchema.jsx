import * as Yup from "yup";
export const AddFolder = Yup.object({
  subjectName: Yup.string().required(" Folder name is required"),
});

export const updateProfileSchema = Yup.object({
  name: Yup.string().required(" name is required"),
  email: Yup.string().required("email is required"),
  phone: Yup.number().required("phone number is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string().required(" Name is required"),
  email: Yup.string().required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Phone number must be valid 10 digits")
    .required("Phone number is required"),
  password: Yup.string().required("Password is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});
