import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../reduxStore/UserSlice";
// import notebookLogo from "../../notebook.jpg";
// import { removeAllFolders } from "../reduxStore/UserSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userData = useSelector((state) => state.loginUser);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  return (
    <>
      <div className="d-flex myheader">
        <div
          style={{
            marginLeft: "14px",
            margin: "2px",
            width: "160px",
          }}
        >
          <span
            onClick={() => {
              navigate("/"), localStorage.removeItem("topicId");
            }}
            style={{ cursor: "pointer" }}
          >
            {/* <img
              src={notebookLogo}
              alt="cloud Notebook"
              height={"55px"}
              width={"150px"}
            /> */}
            <h3 className=" fw-bold text-warning mt-2">CHAT APP</h3>
          </span>
        </div>

        <div className="d-flex justify-content-end w-100">
          {/* <div className=" my-1 ">
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div> */}

          <div className="mt-1">
            <span className="fw-bold   text-light fs-5 ">
              {" "}
              {userData?.name ?? "user"}
            </span>
            <Tooltip title="My Profile" placement="bottom-end">
              <IconButton onClick={handleOpenUserMenu}>
                {" "}
                <Avatar style={{ height: "37px", width: "37px" }}></Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography
                  textAlign="center"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <AccountBoxIcon className="mx-2" />
                  Profile
                </Typography>
              </MenuItem>

              <MenuItem>
                <Typography
                  textAlign="center"
                  onClick={() => {
                    navigate("/login");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("allFolders");
                    dispatch(addUser({}));
                  }}
                >
                  <LogoutIcon className="mx-2" /> Logout
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}
