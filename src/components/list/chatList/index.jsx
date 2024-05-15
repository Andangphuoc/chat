import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import AddUser from "./addUser";
import { useUserStore } from "../../../lib/useStore";
import { db } from "../../../lib/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { userDocRef, userDocSnap } from "firebase/firestore";
import { useChatStore } from "../../../lib/chatStore";
ChatList.propTypes = {};

function ChatList(props) {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();
    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "userChats", currentUser.id),
            async (res) => {
                const items = res.data().chats;
                try {
                    const promises = items?.map(async (item) => {
                        const userDocRef = doc(db, "users", item.receiverId);
                        const userDocSnap = await getDoc(userDocRef);
                        const user = userDocSnap.data();
                        return { ...item, user };
                    });
                    const chatData = await Promise.all(promises);
                    if (chatData) {
                        setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        );
        return () => {
            unSub();
        };
    }, [currentUser.id]);
    const handleSelect = async (chat) => {
        const userChat = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChat.findIndex((item) => item.chatId === chat.chatId);
        userChat[chatIndex].isCeen = true;

        const userChatRef = doc(db, "userChats", currentUser.id);
        try {
            const userChatSnap = await getDoc(userChatRef);
            if (!userChatSnap.exists()) {
                console.error("No document to update");
                return;
            }

            await updateDoc(userChatRef, {
                chats: userChat,
            });

            changeChat(chat.chatId, chat.user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./img/search.png" alt="" />
                    <input type="text" placeholder="search" />
                </div>
                <img
                    src={addMode ? "./img/minus.png" : "./img/plus.png"}
                    className="add"
                    alt=""
                    onClick={() => setAddMode((prev) => !prev)}
                />
            </div>

            {chats?.map((chat) => (
                <div
                    className="item"
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    style={{
                        backgroundColor: chat?.isCeen ? "transparent" : "#5183fe",
                    }}
                >
                    <img src="./img/avatar.png" alt="" srcset="" />
                    <div className="texts">
                        <span>{chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addMode && <AddUser />}
        </div>
    );
}
export default ChatList;
