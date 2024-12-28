import { Navigate } from "react-router-dom";
import Index from "./Index";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Index /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
