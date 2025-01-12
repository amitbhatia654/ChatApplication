import React, { useEffect, useMemo, useState, useRef } from "react";
import Modal from "../pages/HelperPages/Modal";
import { Form, Formik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { Avatar, Button, TextField } from "@mui/material";
import axiosInstance from "../ApiManager";
import { useSelector } from "react-redux";
import { useSocketContext } from "./SocketContext";
import sendTone from "../assets/send_tone.mp3";
import r_tone from "../assets/r_tone.mp3";
import chat_tone from "../assets/chat-tone.mp3";

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

      if (res.status == 200) {
        const audio = new Audio(sendTone);
        audio.play();
        setMessage("");
      }
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
    if (res.status == 200) {
      setAllChats(res.data.chats);
    } else {
      setAllChats([]);
    }
  };

  useEffect(() => {
    selectedChatRef.current = selectedChat; // Update ref when selectedChat changes
  }, [selectedChat]);

  useEffect(() => {
    fetchAllUsers();
    fetchAllChats();
  }, []);

  // behavior: "smooth";

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
    }
  }, [selectedChat.messages]);

  useEffect(() => {
    socket?.on("new-message", (data) => {
      const currentChat = selectedChatRef.current?.participants?.some(
        (participant) => participant._id === data?.senderId
      );

      if (currentChat) {
        // Add the new message to the messages array
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
        }));
        const audio = new Audio(chat_tone);
        audio.play();
      } else {
        const audio = new Audio(r_tone);
        audio.play();
        fetchAllChats();
      }

      // allChats.forEach((chat) => {
      //   // Check if both receiverId and senderId exist in the participants array
      //   const receiverExists = chat.participants.some(
      //     (participant) => participant._id === data.receiverId
      //   );
      //   const senderExists = chat.participants.some(
      //     (participant) => participant._id === data.senderId
      //   );

      //   if (receiverExists && senderExists) {
      //     // Push the new message into the messages array
      //     chat.messages.push(data);
      //     const audio = new Audio(r_tone);
      //     audio.play();
      //   }
      // });
    });

    return () => socket?.off("new-message");
  }, [socket]);

  const chats = allChats
    .flatMap((conversation) => conversation.participants)
    .filter((participant) => participant._id != user.id);

  const isOnlineUser = (userId) => {
    return onlineUsers.includes(userId);
  };

  const isCurrentChat = (chat) => {
    return selectedChat?.participants?.find(
      (participant) => participant._id == chat._id
    );
  };

  const covertIntoTime = (createdAt) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", options);
  };

  return (
    <>
      <div className="py-1 chat-container">
        <div className="d-flex">
          <div className="chat-bar">
            <button
              className="bbtn btn-primary m-1"
              onClick={() => setNewChatModal(true)}
            >
              New Chat{" "}
            </button>

            <h4 className="text-center mt-2">Recent Chats</h4>
            <div>
              {chats.length > 0 ? (
                chats.map((chat, id) => (
                  <h6
                    className={`chat-name-sidebar ${
                      isCurrentChat(chat) && "current-chat"
                    }`}
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
                    {isOnlineUser(chat._id) && (
                      <span className="green-dot"></span>
                    )}
                  </h6>
                ))
              ) : (
                <div className="text-danger">No Chats Founds</div>
              )}
            </div>
          </div>

          <div className="message-box ">
            {selectedChat?._id ? (
              <div>
                <div className="d-flex px-2">
                  <Avatar
                    style={{ height: "37px", width: "37px" }}
                    src={`${
                      selectedChat?.participants?.find((d) => d._id != user.id)
                        ?.profilePic
                    }`}
                    className="my-1"
                  ></Avatar>
                  {/* {console.log(
                    selectedChat?.participants?.find((d) => d._id != user.id)
                  )} */}
                  <div>
                    <span className="user-name">
                      {
                        selectedChat?.participants?.find(
                          (d) => d._id != user.id
                        )?.name
                      }
                    </span>
                    {isOnlineUser(
                      selectedChat?.participants?.find((d) => d._id != user.id)
                        ._id
                    ) && <span className="green-dot"></span>}
                    <br />

                    <span className="online-text">
                      {isOnlineUser(
                        selectedChat?.participants?.find(
                          (d) => d._id != user.id
                        )._id
                      ) ? (
                        <>online</>
                      ) : (
                        "offline"
                      )}
                    </span>
                  </div>
                </div>{" "}
                <div className="msg-box scrollable-container p-2">
                  {selectedChat.messages.length > 0 &&
                    selectedChat.messages.map((data, key) => {
                      const isLastMessage =
                        key === selectedChat.messages.length - 1;

                      return (
                        <h6
                          key={key}
                          ref={isLastMessage ? lastMessageRef : null}
                          className={`${
                            data.senderId == user.id && "text-end  "
                          } `}
                        >
                          <span
                            className={`msg-span ${
                              data.senderId == user.id
                                ? "msg-span-left"
                                : "msg-span-right"
                            }`}
                          >
                            {data.message}
                          </span>{" "}
                          <span className="msg-time">
                            {covertIntoTime(data?.createdAt)}
                          </span>
                        </h6>
                      );
                    })}
                </div>
                <div class="input-group ">
                  <textarea
                    value={message}
                    className="my-text-input"
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <button
                    className="btn btn-primary "
                    onClick={() => sendMessage()}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "500px" }}
              >
                <h4 className="">
                  Hello Welcome{" "}
                  <span className="text-primary">{user.name} </span> <br></br>
                  Start Chat With Your Friends
                </h4>
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
                          // sx={{ width: 300 }}
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
