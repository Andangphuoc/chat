import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../../../lib/firebase';
import { update } from 'firebase/database';
import { useUserStore } from '../../../../lib/useStore';
import { arrayUnion } from "firebase/firestore";


AddUser.propTypes = {
    
};

function AddUser(props) {
    
    const [user,setUser] = useState(null)
    const handleSearch = async (e) => {
        e.preventDefault();    
        const formData = new FormData(e.target);
        const username = formData.get("username");   
        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (error) {
            console.log(error);
        }
    };
    const {currentUser} = useUserStore()
    const handleAddUser =async e =>{
        e.preventDefault();
        const chatRef = collection(db, "chats");
        const userChatRef = collection(db, "userChats");
        try {
            const newChatRef = doc(chatRef)
            await setDoc(newChatRef ,{
                createAt: serverTimestamp(),
                messages:[] 
            }) 
            await updateDoc(doc(userChatRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updateAt: Date.now()
                })
            });
            // Thêm thông tin cuộc trò chuyện với currentUser vào tài liệu của user
            await updateDoc(doc(userChatRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updateAt: Date.now()
                })
            });
        } catch (error) {
            console.log("New chat document addedsadddddddddd:" + error)
        }
    }
    return (
        <div className='addUser'>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>
            
            { user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./img/avatar.png"} alt="" />
                    <span>{user.username}</span>                
                </div>
                <button onClick={handleAddUser}>Add User</button>
            </div>
            }

        </div>
    );
}

export default AddUser;