import React, { useEffect, useMemo, useState, useRef } from "react";
import Modal from "../pages/HelperPages/Modal";
import { Form, Formik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField } from "@mui/material";
import axiosInstance from "../ApiManager";
import { useSelector } from "react-redux";
import { useSocketContext } from "./SocketContext";

export default function HomePage() {
  const user = useSelector((data) => data.loginUser);

  const [newChatModal, setNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});
  const [message, setMessage] = useState("");
  const { onlineUsers, socket } = useSocketContext();

  const selectedChatRef = useRef(selectedChat);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat; // Update ref when selectedChat changes
  }, [selectedChat]);

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

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data.m1],
      }));

      console.log(res, "when user send the message");

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
  }, []);

  useEffect(() => {
    fetchAllChats();
  }, [selectedChat]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat.messages]);

  useEffect(() => {
    const checkMessage = socket?.on("new-message", (data) => {
      console.log(data, "check message");

      const res = selectedChatRef.current?.participants?.some(
        (participant) => participant._id === data?.senderId
      );

      if (res) {
        // Add the new message to the messages array
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
        }));
      }
    });

    return () => socket?.off("new-message");
  }, [socket]);

  const chats = allChats
    .flatMap((conversation) => conversation.participants)
    .filter((participant) => participant._id != user.id);

  // console.log(chats, "the chats is");

  const isOnlineUser = (userId) => {
    return onlineUsers.includes(userId);
  };

  return (
    <>
      <div className="px-4 py-4 chat-container">
        <div className="d-flex">
          <div className="chat-bar">
            <button
              className="bbtn btn-primary m-1"
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
                    className={`${isOnlineUser(chat._id) && "text-danger"}`}
                    onClick={() => {
                      const result = allChats.find((conversation) =>
                        conversation.participants.some(
                          (participant) => participant._id === chat._id
                        )
                      );

                      setSelectedChat(result);
                    }}
                  >
                    {chat.name} {isOnlineUser(chat._id)}
                  </h6>
                ))
              ) : (
                <div className="text-danger">No Chats Founds</div>
              )}
            </div>
          </div>

          {console.log(selectedChat, "the selected chat is ")}

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
                    selectedChat.messages.map((data, key) => {
                      const isLastMessage =
                        key === selectedChat.messages.length - 1;

                      return (
                        <h6
                          key={key}
                          ref={isLastMessage ? lastMessageRef : null}
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
