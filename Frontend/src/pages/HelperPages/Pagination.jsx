import { Button, MenuItem, TextField } from "@mui/material";

export default function Pagination({
  currentPage,
  setCurrentPage,
  rowSize,
  setRowSize,
  totalPages,
}) {
  return (
    <>
      <div className="container-fluid">
        <div
          className="row "
          style={
            {
              // boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.2)",
              // backgroundColor: "#47478C",
            }
          }
        >
          <div className="col-md-6 mx-auto d-flex  flex-sm-row align-items-center justify-content-center py-1 ">
            <span className="">Rows Per Page</span>

            <TextField
              select
              value={rowSize}
              onChange={(e) => setRowSize(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mt: 1, m: 1 }}
            >
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="12">12</MenuItem>
              <MenuItem value="18">18</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              sx={{
                color: "blue",
                backgroundColor: "white",
                fontSize: "12px",
              }}
              disabled={currentPage === 1}
            >
              {"< prev"}
            </Button>

            <span className="mx-1">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outlined"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              sx={{
                my: 1,
                color: "blue",
                backgroundColor: "white",
                fontSize: "12px",
              }}
              disabled={currentPage === totalPages}
            >
              {"Next >"}
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="d-flex justify-content-center   ">
        <span className="m-3">Rows Per Page</span>
        <TextField
          select
          value={rowSize}
          onChange={(e) => setRowSize(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mt: 1, mx: 2 }}
        >
          <MenuItem value="6">6</MenuItem>
          <MenuItem value="12">12</MenuItem>
          <MenuItem value="18">18</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          sx={{
            my: 1,
            color: "blue",
            backgroundColor: "white",
            fontSize: "13px",
          }}
          disabled={currentPage === 1}
        >
          {"< prev"}
        </Button>

        <span className="m-3">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outlined"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          sx={{
            my: 1,
            color: "blue",
            backgroundColor: "white",
            fontSize: "13px",
          }}
          disabled={currentPage === totalPages}
        >
          {"Next >"}
        </Button>
      </div> */}
    </>
  );
}
