"use client";
import React from "react";
import {
  CircleStackIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function ChatInput({ chatId }) {
  const {
    chats,
    setChats,
    messages,
    newChatboxNames,
    setNewChatboxNames,
    setMessages,
    userId,
  } = useGlobalContext();

  const router = useRouter();

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("press input");
    const newMessage = {
      chatbox_id: chatId,
      message: prompt,
      message_type: "user",
      user_id: 0,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setPrompt("");

    // Send the message to the server from axios
    try {
      setIsLoaded(true);
      console.log("sending message");
      const response = await axios.post(
        "http://localhost:8000/chatbox/message",
        newMessage,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // check is this chatbox is new
      if (messages.length === 0) {
        const responseNew = await axios.put(
          `http://localhost:8000/chatbox/${chatId}`,
          {
            chat_name: `${prompt}`,
            user_id: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setIsLoaded(false);

        window.location.reload();

        console.log(responseNew.data);
        setChats(responseNew.data);

        console.log("new chatbox", chats);
        setNewChatboxNames([...newChatboxNames, chatId]);
      }

      console.log(response.data);
      const answer = {
        user_id: userId,
        chatbox_id: chatId,
        message: response.data,
        message_type: "gpt",
      };
      setMessages((prevMessages) => [...prevMessages, answer]);
      setIsLoaded(false);
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Please login to continue");

        //remove token
        localStorage.removeItem("token");

        router.push("/");
      } else {
        toast.error("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="bg-gray-700/50 mx-5 my-2 text-white rounded-lg text-s">
      {isLoaded && (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoaded && (
        <form
          onSubmit={sendMessage}
          className="p-5 space-x-5 flex items-center"
        >
          <UserIcon className="h-5 w-5 animate-bounce" />
          <input
            className="m focus:ouline-none bg-transparent outline-none flex-1 disabled:cursor-not-allowed disabled:text-white"
            value={prompt}
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message"
          />
          <button
            type="submit"
            disabled={!prompt}
            className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5 -rotate-45 animate-pulse" />
          </button>
        </form>
      )}
    </div>
  );
}

export default ChatInput;
