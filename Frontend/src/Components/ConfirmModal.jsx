import { Button } from "@mui/material";

export default function ConfirmModal({ title, setConfirmModalData, onClose }) {
  return (
    <>
      <div className="modal show d-block " tabIndex="-1" role="dialog">
        <div className="modal-dialog  modal-dialog-centered " role="document">
          <div className="modal-content mymodal">
            <h5 className="modal-tit text-center mt-3">{title}</h5>
            <div className="modal-body">
              <div className="d-flex justify-content-center">
                <Button
                  variant="outlined"
                  sx={{
                    my: 1,
                    color: "#47478c",
                    backgroundColor: "white",
                    fontSize: "14px",
                  }}
                  onClick={() => {
                    onClose("no");
                    setConfirmModalData({ open: false });
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    m: 1,
                    color: "white",
                    backgroundColor: "blue",
                    fontSize: "14px",
                  }}
                  onClick={() => {
                    onClose("yes");
                    setConfirmModalData({ open: false });
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
