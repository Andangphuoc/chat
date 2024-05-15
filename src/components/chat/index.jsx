import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import EmojiPicker from "emoji-picker-react";
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/useStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uploadFile from "../../lib/uploadFile";

const storage = getStorage();

Chat.propTypes = {};

function Chat(props) {
    const [openEmoji, setOpenEmoji] = useState(false);
    const [chat, setChat] = useState(null);
    const { chatId, user } = useChatStore();
    const { currentUser } = useUserStore();
    const [text, setText] = useState("");

    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const endRef = useRef(null);

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpenEmoji(false);
    };

    useEffect(() => {
        if (chatId) {
            const chatRef = doc(db, "chats", chatId);
            const unSub = onSnapshot(chatRef, (res) => {
                if (res.exists()) {
                    setChat(res.data());
                    endRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            });
            return () => {
                unSub();
            };
        }
    }, [chatId]);
    const handleSendMessage = async () => {
        if (text.trim() === "" && !img.file) return;

        let imgUrl = null;
        try {
            if (img.file) {
                imgUrl = await uploadFile(img.file);
            }

            const message = {
                senderId: currentUser.id,
                text,
                createdAt: new Date(),
                ...(imgUrl && { img: imgUrl })
            };

            const chatRef = doc(db, "chats", chatId);

            // Update the chat document with the new message
            await updateDoc(chatRef, {
                messages: arrayUnion(message),
            });

            // Update the userChats documents for both users
            const userIDs = [currentUser.id, user.id];
            for (const id of userIDs) {
                const userChatRef = doc(db, "userChats", id);
                const userChatsSnapshot = await getDoc(userChatRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = (id === currentUser.id);
                        userChatsData.chats[chatIndex].updateAt = Date.now();

                        await updateDoc(userChatRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setText("");
            setImg({ file: null, url: "" });
        }
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./img/avatar.png" alt="" />
                    <div className="texts">
                        <span>{user.username}</span>
                        <p>Chat description or last message...</p>
                    </div>
                </div>
                <div className="icon">
                    <img src="./img/phone.png" alt="" />
                    <img src="./img/video.png" alt="" />
                    <img src="./img/info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message.createdAt}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="attachment" />}
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="preview" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icon">
                    <label htmlFor="file">
                        <img src="./img/img.png" alt="upload" />
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleImg}
                        style={{ display: "none" }}
                    />
                    <img src="./img/camera.png" alt="camera" />
                    <img src="./img/mic.png" alt="microphone" />
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <div className="emoji">
                    <img
                        src="./img/emoji.png"
                        alt="emoji"
                        onClick={() => setOpenEmoji((prev) => !prev)}
                    />
                    {openEmoji && (
                        <div className="picker">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className="sendButton" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;
