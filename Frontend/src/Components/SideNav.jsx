import { Link, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import GradingIcon from "@mui/icons-material/Grading";
import { useSelector } from "react-redux";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

// import { useFirebase } from "../context/Firebase";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

export default function SideNav({ isOpen }) {
  const location = useLocation();

  const routes = [
    { path: "Users", logo: <GroupIcon />, isAdmin: false },
    { path: "employees", logo: <ContactEmergencyIcon />, isAdmin: true },
    { path: "Messages", logo: <SwitchAccountIcon />, isAdmin: true },
    { path: "orders", logo: <GradingIcon />, isAdmin: true },
    { path: "settings", logo: <SettingsIcon />, isAdmin: true },
    { path: "profile", logo: <AccountBoxIcon />, isAdmin: true },
  ];
  return (
    <>
      <Link
        to={"/"}
        style={{
          textDecoration: "none",
          textTransform: "capitalize",
          fontSize: "16px",
          color: `${location.pathname == "/" ? "blue" : "black"}`,
        }}
      >
        <Box
          sx={{
            mx: 1,
            my: 1,
            p: 1,
            boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
          }}
          // backgroundColor={`${location.pathname == "/" ? "#4eaefc" : ""}`}
        >
          <WidgetsIcon />
          <Box
            component={"span"}
            sx={{ display: `${isOpen && "none"}`, mx: 1 }}
          >
            DASHBOARD
          </Box>
        </Box>
      </Link>
      {routes.map((data, index) => {
        // if (user.isAdmin == true || (user.isAdmin == false && data.isAdmin))
        return (
          <div key={index} className="menu-items">
            <Link
              to={data?.path}
              style={{
                textDecoration: "none",
                textTransform: "capitalize",
                fontSize: "16px",
                color: `${
                  location.pathname.slice(1) == data.path ? "blue" : "black"
                }`,
              }}
            >
              <Box
                sx={{
                  mx: 1,
                  my: 1,
                  p: 1,
                  boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.3)",
                  borderRadius: "8px",
                }}
                index={index}
              >
                <span> {data?.logo}</span>
                <Box
                  component={"span"}
                  sx={{ display: `${isOpen && "none"}`, mx: 1, my: 1 }}
                >
                  {data?.path.toUpperCase()}
                </Box>
              </Box>
            </Link>
          </div>
        );
      })}
    </>
  );
}
