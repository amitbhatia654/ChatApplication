import {
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ContainerPage from "../HelperPages/ContainerPage";
import { useEffect, useState } from "react";
import axiosInstance from "../../ApiManager";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import noResult from "../../../images/no-results3.jpeg";
import { useSelector } from "react-redux";

export default function UsersDetails() {
  const user = useSelector((state) => state.loginUser);

  const [allemployee, setAllEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [rowSize, setRowSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / rowSize);

  const fetchData = async () => {
    setLoading(true);
    const res = await axiosInstance.get("/api/auth/users", {
      params: { search, rowSize, currentPage },
    });
    if (res.status == 200) {
      setAllEmployee(res.data.response);
      setTotalCount(res.data.totalCount);
    } else {
      setAllEmployee([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const res = await axiosInstance.delete(`/api/delete-user/${id}`);
    if (res.status == 200) {
      toast.success(res.data.message);
      setAllEmployee(allemployee.filter((data) => data._id != id));
    }
  };

  const handleSubmit = async (id, isAdmin) => {
    const res = await axiosInstance.put(`/api/update-profile/${id}`, {
      isAdmin: !isAdmin,
      markAdmin: "true",
      _id: id,
    });

    if (res.status == 200) {
      toast.success(res.data);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, rowSize, currentPage]);
  return (
    <div>
      <ContainerPage
        // showBackBtn={true}
        title={"ALL USERS"}
        // btnTitle={"Add User"}
        showSearch={true}
        setSearch={setSearch}
        rowSize={rowSize}
        setRowSize={setRowSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      >
        <TableContainer
          className="scrollable-container "
          style={{
            maxHeight: "67vh",
            // minHeight: "67vh",
          }}
        >
          <Table aria-label="simple table">
            <TableHead
              sx={{
                backgroundColor: "#47478c",
                color: "wheat",
                position: "sticky",
                top: 0,
              }}
            >
              <TableRow className="tableStyle">
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  S.No.
                </TableCell>
                <TableCell sx={{ color: "white" }}>User Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Phone Number</TableCell>
                <TableCell sx={{ color: "white" }}>Joining Date</TableCell>
                <TableCell sx={{ color: "white" }}>Admin</TableCell>
                <TableCell sx={{ color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="tableBodyStyle">
              {loading ? (
                <TableCell colSpan={8}>
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "300px",
                      textAlign: "center",
                    }}
                  >
                    <div className="loader"></div>
                  </div>
                </TableCell>
              ) : allemployee.length > 0 ? (
                allemployee?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)" }}
                    >
                      {(currentPage - 1) * rowSize + index + 1}
                    </TableCell>
                    <TableCell
                      style={{
                        boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)",
                      }}
                    >
                      {row?.name}
                    </TableCell>
                    <TableCell
                      style={{ boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)" }}
                    >
                      {row?.email}
                    </TableCell>

                    <TableCell
                      style={{ boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)" }}
                    >
                      {row?.phone}
                    </TableCell>

                    <TableCell
                      style={{ boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)" }}
                    >
                      {row?.createdAt?.split("T")[0]}
                    </TableCell>

                    <TableCell
                      style={{ boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)" }}
                    >
                      <TextField
                        select
                        disabled={user.id == row._id}
                        value={row?.isAdmin ? "yes" : "no"}
                        onChange={(e) => handleSubmit(row._id, row?.isAdmin)}
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </TextField>
                    </TableCell>

                    <TableCell
                      style={{ boxShadow: "0px 2px 4px rgba(0 ,0 ,0 ,0.2)" }}
                    >
                      <div>
                        <button
                          style={{
                            color: `${user.id == row._id ? "" : "#47478c"}`,
                            cursor: `${user.id == row._id ? "" : "pointer"}`,
                            border: "1px solid white",
                          }}
                          type="button"
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Delete"
                          disabled={user.id == row._id}
                          onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "300px",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={noResult}
                        alt="No Result Image"
                        height="250px"
                        width="300px"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ContainerPage>
    </div>
  );
}
