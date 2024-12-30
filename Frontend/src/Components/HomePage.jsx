import React, { useEffect, useState } from "react";
import Modal from "../pages/HelperPages/Modal";
import { Form, Formik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField } from "@mui/material";
import axiosInstance from "../ApiManager";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function HomePage() {
  const user = useSelector((data) => data.loginUser);
  const socket = io();
  const [newChatModal, setNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});
  const [message, setMessage] = useState("");

  socket.on("connection", (id) => console.log(id, "socket"));

  const handleSubmit = async (values) => {
    try {
      const res = await axiosInstance.post("/api/new-chat", {
        senderId: user.id,
        recieverId: values.recieverId,
      });
      setNewChatModal(false);
      fetchAllChats();
    } catch (error) {
      console.log(error, "error in new chat");
    }
  };

  const sendMessage = async () => {
    try {
      const res = await axiosInstance.post("/api/send-message", {
        senderId: user.id,
        receiverId: selectedChat?.participants?.find((d) => d._id != user.id)
          ?._id,
        message,
      });

      if (res.status == 200) setMessage("");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchAllUsers = async () => {
    const res = await axiosInstance.get("/api/users");
    if (res.status == 200) {
      setAllUsers(res.data);
    } else {
      setAllUsers([]);
    }
  };

  const fetchAllChats = async () => {
    const res = await axiosInstance.get("/api/all-chats");
    // console.log(res, "the api response is ");
    if (res.status == 200) {
      setAllChats(res.data.chats);
    } else {
      setAllChats([]);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllChats();
  }, []);

  const chats = allChats
    .flatMap((conversation) => conversation.participants)
    .filter((participant) => participant._id != user.id);

  return (
    <>
      <div className="px-4 py-4 chat-container">
        <div className="d-flex">
          <div className="chat-bar">
            <button
              className="bbtn btn-primary"
              onClick={() => setNewChatModal(true)}
            >
              New Chat{" "}
            </button>
            <h4>My Chats</h4>
            <div>
              {chats.length > 0 ? (
                chats.map((chat, id) => (
                  <h6
                    key={id}
                    onClick={() => {
                      const result = allChats.find((conversation) =>
                        conversation.participants.some(
                          (participant) => participant._id === chat._id
                        )
                      );

                      setSelectedChat(result);
                    }}
                  >
                    {chat.name}
                  </h6>
                ))
              ) : (
                <div className="text-danger">No Chats Founds</div>
              )}
            </div>
          </div>

          <div className="message-box">
            {selectedChat?._id ? (
              <div>
                <h5>
                  {
                    selectedChat?.participants?.find((d) => d._id != user.id)
                      ?.name
                  }
                </h5>
                <div className="msg-box scrollable-container">
                  {selectedChat.messages.length > 0 &&
                    selectedChat.messages.map((data) => {
                      console.log(data, "theeh");
                      return (
                        <h6
                          className={`${
                            data.senderId == user.id && "text-end"
                          } `}
                        >
                          <span className="msg-span">{data.message}</span>
                        </h6>
                      );
                    })}
                </div>
                <div className="mt-3">
                  <textarea
                    type="textArea"
                    cols={"100"}
                    rows={"2"}
                    value={message}
                    className=""
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mb-5"
                    onClick={() => sendMessage()}
                  >
                    Send
                  </button>
                </div>
                <div className="text-end"> </div>
              </div>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "500px" }}
              >
                <h4 className="text-primary">Select user and start Chat</h4>
              </div>
            )}
          </div>
        </div>
      </div>

      {newChatModal && (
        <Modal title={"Select User To Chat "} setShowModal={setNewChatModal}>
          <Formik
            initialValues={{ recieverId: "" }}
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
                        <Autocomplete
                          disablePortal
                          options={allUsers.map((user) => ({
                            label: user.name,
                            value: user._id,
                          }))}
                          onChange={(e, data) => {
                            props.setFieldValue("recieverId", data.value);
                          }}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField {...params} label="Select User" />
                          )}
                        />
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
                          //   disabled={loading}
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
    </>
  );
}
