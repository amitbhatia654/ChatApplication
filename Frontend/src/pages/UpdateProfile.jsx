import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { updateProfileSchema } from "../assets/FormSchema";
import axiosInstance from "../ApiManager";
import ContainerPage from "./HelperPages/ContainerPage";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../reduxStore/UserSlice";

export default function UpdateProfile() {
  const user = useSelector((state) => state.loginUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = user.id || "";
  const [loading, setloading] = useState(false);
  const [data, setData] = useState({});

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleSubmit = async (values) => {
    if (values.profilePic) {
      const base64 = await convertFileToBase64(values.profilePic);
      var data = { ...values, profilePic: base64 };
    } else {
      data = values;
    }

    setloading(true);
    const res = await axiosInstance.put(`/api/auth/update-profile/${id}`, {
      ...data,
    });
    const user = {
      id: res.data.data._id,
      name: values.name,
    };
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(addUser(user));
    setloading(false);
    if (res.status == 200) {
      toast.success(res.data.message);
      navigate("/profile");
    }
  };

  const getEmpById = async () => {
    const result = await axiosInstance.get(`/api/auth/update-profile/${id}`);

    if (result) {
      setData(result.data);
    } else {
      setData({});
    }
  };

  useEffect(() => {
    if (id) getEmpById();
  }, []);
  return (
    <div className=" mt-2" style={{ boxShadow: "1px 1px 2px 2px grey" }}>
      <div className="d-flex justify-content-between mt-2">
        <div>
          <button
            style={{
              color: "white",
              backgroundColor: "blue",
              height: "30px",
              marginTop: "3px",
              border: "0px",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Back
          </button>
        </div>
        <h3 className="fw-bold">UPDATE PROFILE</h3>
        <div>.</div>
      </div>
      <Formik
        initialValues={
          id
            ? {
                _id: data._id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                department: data.department || null,
                address: data.address || null,
              }
            : {
                name: "",
                email: "",
                phone: "",
                department: "",
                address: "",
              }
        }
        validationSchema={updateProfileSchema}
        enableReinitialize={true}
        onSubmit={(values) => handleSubmit(values)}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <div
              className=" p-2 mt-1"
              style={
                {
                  //   boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.2)",
                  //   minHeight: "74vh",
                }
              }
            >
              <div className="container p-3">
                <div className="row">
                  <div className="col-md-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      <InputLabel
                        shrink={Boolean(props.values.name)}
                        htmlFor="name"
                      >
                        Name
                      </InputLabel>
                      <OutlinedInput
                        id="name"
                        name="name"
                        placeholder="enter name"
                        value={props.values.name}
                        onChange={props.handleChange}
                        label="Name"
                      />
                    </FormControl>
                    <ErrorMessage
                      name="name"
                      component={"div"}
                      className="text-danger"
                    ></ErrorMessage>
                  </div>

                  <div className="col-md-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      <InputLabel
                        shrink={Boolean(props.values.email)} // Label stays at the top when there's a value
                        htmlFor="email"
                      >
                        Email
                      </InputLabel>
                      <OutlinedInput
                        id="email"
                        name="email"
                        disabled
                        placeholder="enter email"
                        type="email"
                        value={props.values.email}
                        onChange={props.handleChange}
                        label="Email" // Links InputLabel with OutlinedInput
                      />
                    </FormControl>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      <InputLabel
                        shrink={Boolean(props.values.phone)} // Keeps label at the top when there's a value
                        htmlFor="phone"
                      >
                        Phone Number
                      </InputLabel>
                      <OutlinedInput
                        id="phone"
                        name="phone"
                        placeholder="enter phone number"
                        type="number"
                        value={props.values.phone}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            props.setFieldValue("phone", e.target.value);
                          }
                        }}
                        label="Phone Number" // Links InputLabel with OutlinedInput
                      />
                    </FormControl>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      <InputLabel
                        shrink={Boolean(props.values.department)} // Keeps label at the top when there's a value
                        htmlFor="department"
                      >
                        Department
                      </InputLabel>
                      <OutlinedInput
                        id="department"
                        name="department"
                        placeholder="enter department"
                        value={props.values.department}
                        onChange={props.handleChange}
                        label="Department" // Links InputLabel with OutlinedInput
                      />
                    </FormControl>
                    <ErrorMessage
                      name="department"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      <InputLabel
                        shrink={Boolean(props.values.address)}
                        htmlFor="address"
                      >
                        Address
                      </InputLabel>
                      <OutlinedInput
                        id="address"
                        name="address"
                        placeholder="enter address"
                        value={props.values.address}
                        onChange={props.handleChange}
                        label="Address"
                      />
                    </FormControl>
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-md-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                    >
                      <InputLabel
                        shrink={true} // Keeps label at the top when there's a value
                      >
                        Profile Pic
                      </InputLabel>
                      <OutlinedInput
                        type="file"
                        onChange={(e) =>
                          props.setFieldValue("profilePic", e.target.files[0])
                        }
                      />
                    </FormControl>
                  </div>

                  <div className="d-flex justify-content-center my-5">
                    <Button
                      variant="outlined"
                      sx={{
                        m: 1,
                        color: "#47478c",
                        backgroundColor: "white",
                        fontSize: "16px",
                      }}
                      onClick={() => navigate("/profile")}
                      disabled={loading}
                    >
                      cancel
                    </Button>
                    <Button
                      variant="outlined"
                      type="submit"
                      sx={{
                        my: 1,
                        color: "white",
                        backgroundColor: "blue",
                        fontSize: "16px",
                      }}
                      disabled={loading}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
