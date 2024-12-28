import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../HelperPages/Modal";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import toast from "react-hot-toast";
import TopicBody from "./TopicBody";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShowToast from "../../Components/CommonFunctions";
import RearrangeTopicOrder from "../../Components/RearrangeTopicOrder";
import { useDispatch } from "react-redux";
import { addFolder } from "../../reduxStore/UserSlice";
import ConfirmModal from "../../Components/ConfirmModal";

export default function TopicLayout({
  selectedFolder,
  setSelectedFolder,
  allFolders,
  setAllFolders,
  writeData,
  setWriteData,
  fetching,
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editTopic, setEditTopic] = useState({});
  const [search, setSearch] = useState("");
  const [reArrangeOrder, setReArrangeOrder] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    open: false,
    answer: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("topicId")) {
      if (getTopics().length > 0) {
        setCurrentTopic(getTopics()[0]);
      }
    } else {
      setCurrentTopic(
        getTopics().filter(
          (data) => data._id == localStorage.getItem("topicId")
        )[0]
      );
    }
  }, [selectedFolder, search]);

  function getTopics() {
    if (search) {
      return selectedFolder.topics.filter((topic) =>
        topic.title.toLowerCase().includes(search.toLowerCase())
      );
    } else return selectedFolder?.topics;
  }

  const handleSubmit = async (values) => {
    setSearch("");
    setloading(true);
    const res = editTopic._id
      ? await axiosInstance.put(`/api/topic`, {
          ...values,
          folderId: selectedFolder._id,
          topicId: editTopic._id,
        })
      : await axiosInstance.post(`/api/topic`, {
          ...values,
          selectedFolder,
        });

    const updatedFolder = allFolders.map((folder) => {
      if (folder._id == selectedFolder._id) {
        return res.data.subject;
      }

      return folder;
    });

    setAllFolders(updatedFolder);
    setSelectedFolder(res.data.subject);

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data.message);
      setEditTopic({});
      setShowModal(false);
    }
  };

  const showConfirmationModal = () => {
    return new Promise((resolve) => {
      setConfirmModalData({
        open: true,
        onClose: (answer) => {
          resolve(answer);
        },
      });
    });
  };

  const deleteTopic = async (topicId) => {
    const userResponse = await showConfirmationModal();
    if (userResponse != "yes") return;

    setSearch("");
    const res = await axiosInstance.delete(`/api/topic`, {
      data: {
        folderId: selectedFolder._id,
        topicId: topicId,
      },
    });

    if (res.status == 200) {
      toast.success(res.data.message);
      const updatedFolders = allFolders.map((folder) => {
        if (folder._id == selectedFolder._id) {
          return {
            ...folder,
            topics: folder.topics.filter((topic) => topic._id !== topicId),
          };
        }
        return folder;
      });

      setAllFolders(updatedFolders);
      setSelectedFolder(
        updatedFolders.filter((folder) => folder._id == selectedFolder._id)[0]
      );

      const currentIndex = getTopics()?.findIndex(
        (topic) => topic?._id == topicId
      );

      if (getTopics().length <= 1) {
        setCurrentTopic({});
        localStorage.removeItem("topicId");
      } else {
        if (currentIndex == 0) {
          setCurrentTopic(getTopics()[currentIndex + 1]);
          localStorage.setItem("topicId", getTopics()[currentIndex + 1]._id);
        } else {
          setCurrentTopic(getTopics()[currentIndex - 1]);
          localStorage.setItem("topicId", getTopics()[currentIndex - 1]._id);
        }
      }
    } else toast.error(res.data.message);
  };

  const handleChangeTopic = (topic) => {
    if (writeData) {
      ShowToast();
      return;
    }
    setCurrentTopic(topic), localStorage.setItem("topicId", topic._id);
  };

  return (
    <>
      <div className="d-flex main-body">
        <div
          className={!isOpen ? "sidenav-full" : "sidenav-small"}
          style={{
            borderRight: "1px solid grey",
          }}
        >
          <div className="d-flex justify-content-between ">
            <h4 className={` topic-heading ${isOpen && "d-none"}`}>
              {" "}
              Topics
              <span className="dropdown ">
                <button
                  className="btn "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h6>
                    <MoreVertIcon sx={{ fontSize: "19px" }} />
                  </h6>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        if (writeData) {
                          ShowToast();
                          return;
                        }
                        setReArrangeOrder(true);
                        dispatch(addFolder(selectedFolder));
                      }}
                    >
                      Change The Topics Sequence
                    </button>
                  </li>
                </ul>
              </span>
            </h4>
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  color: "blue",
                  border: "1px solid white",
                  fontSize: "14x",
                }}
              >
                {isOpen ? (
                  <MenuIcon fontSize="small" />
                ) : (
                  <CloseIcon fontSize="small" />
                )}
              </button>
            </div>
          </div>

          <div className={`${isOpen && "d-none"} px-2 `}>
            <div>
              <TextField
                type="text"
                sx={{ mb: 1 }}
                size="small"
                value={search}
                onChange={(e) => {
                  if (writeData) {
                    ShowToast();
                    return;
                  }
                  setSearch(e.target.value);
                  localStorage.removeItem("topicId");
                  setCurrentTopic({});
                }}
                placeholder="search"
              ></TextField>
            </div>

            <div className="new-topic mb-2" onClick={() => setShowModal(true)}>
              Create Topic +{" "}
            </div>

            <div
              style={{ minHeight: "69vh", maxHeight: "69vh" }}
              className="scrollable-container topic-div "
            >
              {getTopics()?.length < 1 ? (
                <h5 className="text-center text-primary my-4">
                  No Topic Found!
                </h5>
              ) : (
                getTopics().map((topic, index) => {
                  return (
                    <div
                      style={{ userSelect: "none" }}
                      className="d-flex justify-content-between topicNames align-items-center"
                      key={index}
                    >
                      <div
                        className={`names  border-primary ${
                          currentTopic?._id == topic?._id && "currentTopic"
                        }`}
                        onClick={() => {
                          handleChangeTopic(topic);
                        }}
                      >
                        {index + 1}.{" "}
                        {topic?.title?.charAt(0)?.toUpperCase() +
                          topic?.title?.slice(1)}
                      </div>

                      <div>
                        <div className="dropdown">
                          <button
                            className="btn "
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <h6>
                              <MoreVertIcon sx={{ fontSize: "19px" }} />
                            </h6>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  if (writeData) {
                                    ShowToast();
                                    return;
                                  }
                                  setEditTopic(topic), setShowModal(true);
                                }}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  if (writeData) {
                                    ShowToast();
                                    return;
                                  }
                                  deleteTopic(topic._id);
                                }}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              paddingLeft: "5px",
            }}
          >
            {reArrangeOrder ? (
              <RearrangeTopicOrder
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                setReArrangeOrder={setReArrangeOrder}
                reArrangeOrder={reArrangeOrder}
              />
            ) : (
              <TopicBody
                currentTopic={currentTopic}
                setCurrentTopic={setCurrentTopic}
                writeData={writeData}
                setWriteData={setWriteData}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                allFolders={allFolders}
                fetching={fetching}
              ></TopicBody>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          otherFunc={setEditTopic}
          title={`${editTopic._id ? "Edit" : "Create"} Topic `}
          handleSubmit={handleSubmit}
        >
          <Formik
            initialValues={{ title: editTopic ? editTopic.title : "" }}
            // validationSchema={addEmployee}
            enableReinitialize={true}
            onSubmit={(values) => handleSubmit(values)}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <div className=" ">
                  <div className="container-fluid ">
                    <div className="row">
                      <div className="">
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ m: 1 }}
                        >
                          <InputLabel
                            shrink={Boolean(props.values.title)}
                            htmlFor="title"
                          >
                            Name
                          </InputLabel>
                          <OutlinedInput
                            id="title"
                            name="title"
                            placeholder="enter name"
                            value={props.values.title}
                            onChange={props.handleChange}
                            label="Name"
                          />
                        </FormControl>
                        <ErrorMessage
                          name="title"
                          component={"div"}
                          className="text-danger"
                        ></ErrorMessage>
                      </div>

                      <div className="d-flex justify-content-center my-5">
                        <Button
                          variant="outlined"
                          type="submit"
                          sx={{
                            my: 1,
                            color: "#47478c",
                            backgroundColor: "white",
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
        </Modal>
      )}

      {confirmModalData.open && (
        <ConfirmModal
          title={"Are You Sure You Want to Delete"}
          setConfirmModalData={setConfirmModalData}
          onClose={confirmModalData.onClose}
        ></ConfirmModal>
      )}
    </>
  );
}
