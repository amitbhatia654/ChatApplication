import React from "react";

export default function LoadingComponent() {
  return (
    <>
      <div>
        <div className="d-flex justify-content-center align-items-center mt-5 ">
          <div className="">
            <div className="spinner-grow text-primary mx-2" role="status"></div>
            <div
              className="spinner-grow text-secondary mx-2"
              role="status"
            ></div>
            <div className="spinner-grow text-success mx-2" role="status"></div>
            <div className="spinner-grow text-danger mx-2" role="status"></div>
            <div className="spinner-grow text-warning mx-2" role="status"></div>
            <div className="spinner-grow text-info mx-2" role="status"></div>
          </div>
        </div>
      </div>
    </>
  );
}
