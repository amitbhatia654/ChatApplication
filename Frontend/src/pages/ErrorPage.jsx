import { useNavigate } from "react-router-dom";
// import ErrorImage from "../images/ErrorPage.png";
import ErrorImage from "../../images/errorpage.png";
import { Button } from "@mui/material";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="d-flex flex-column align-items-center">
        <img height={400} width={400} src={ErrorImage} alt="Error Image" />

        <Button
          variant="outlined"
          sx={{
            my: 1,
            color: "#47478c",
            backgroundColor: "white",
            fontSize: "16px",
          }}
          onClick={() => navigate("/")}
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
