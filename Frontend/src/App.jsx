import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import React, { Suspense, lazy } from "react";
import PrivateRoute from "./pages/PrivateRoute";
import ErrorPage from "./pages/ErrorPage";
import LoadingComponent from "./Components/LoadingComponent";
import HomePage from "./Components/HomePage";

const MyProfile = lazy(() => import("./pages/MyProfile"));
const UpdateProfile = lazy(() => import("./pages/UpdateProfile"));
const LoginRegister = lazy(() => import("./pages/Users/LoginRegister"));
const UsersDetails = lazy(() => import("./pages/Users/UsersDetails"));

function App() {
  const isUserLogin = () => {
    return Boolean(localStorage.getItem("token"));
  };

  // eslint-disable-next-line react/prop-types
  const ProtectedLoginRoute = ({ children }) => {
    if (isUserLogin()) {
      return <Navigate to="/" replace></Navigate>;
    }
    return children;
  };

  return (
    <>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <LoadingComponent />
          </div>
        }
      >
        <Routes>
          <Route
            path="/login"
            element={
              <ChakraProvider>
                <ProtectedLoginRoute>
                  <LoginRegister />
                </ProtectedLoginRoute>
              </ChakraProvider>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <ChakraProvider>
                <ProtectedLoginRoute>
                  <LoginRegister />
                </ProtectedLoginRoute>
              </ChakraProvider>
            }
          ></Route>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<HomePage></HomePage>} />

            <Route path="profile" element={<MyProfile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="users" element={<UsersDetails />} />
          </Route>

          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
