import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 
import uploadFile from '../../lib/uploadFile';
import { useUserStore } from '../../lib/useStore';
import { useNavigation } from 'react-router-dom';

Login.propTypes = {
    
};

function Login(props) {
    const [avatar,setAvatar] = useState({
        file:null,
        url:""
    })
    const handleAvatar = e =>{
        if(e.target.files[0]){
            setAvatar({
                file:e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }


    //Login
    const handleLogin = async (e) =>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target);
        const {email,password} = Object.fromEntries(formData)
        
        try {
            const loginAuth = await signInWithEmailAndPassword(auth,email,password);
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     const formData = new FormData(e.target);
    //     const { email, password } = Object.fromEntries(formData);
        
    //     try {
    //         // Sign in with email and password
    //         const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //         const user = userCredential.user;

    //         // Fetch user info from Firestore using Zustand
    //         const userStore = useUserStore.getState();
    //         await userStore.fetchUserInfo(user.uid);

    //         toast.success("Logged in successfully!");
    //     } catch (error) {
    //         toast.error(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const [loading,setLoading] = useState(false)

    //Register
    const handleRegister = async  (e)=>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target);
        const {username, email,password} = Object.fromEntries(formData)
        
        try {
            const res = await createUserWithEmailAndPassword(auth,email,password)

            const imgUrl = await uploadFile(avatar.file)

            //https://firebase.google.com/docs/firestore/manage-data/add-data?hl=vi#:~:text=There%20are%20several%20ways%20to%20write%20data%20to,generated%20identifier%2C%20and%20assign%20data%20to%20it%20later.
            //add data vao cloud firebase
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avartar: imgUrl,
                id : res.user.uid,
                blocked: [],
            });
            await setDoc(doc(db, "userChats", res.user.uid), {
                chatUser: []
            });
            toast.success("Account created! You can login now!!!")
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className='login'>
            <div className="item">
                <h2>Welcom back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" name="email" placeholder='Email' id="" />
                    <input type="password" name="password" placeholder='Password' id="" />
                    <button disabled={loading}>{loading ? "Loaing" :"Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create a new account</h2>
                <form onSubmit={handleRegister} >
                    <label htmlFor="file">
                        <img src={avatar.url || "./img/avatar.png"} alt="" />
                        Upload an image</label>
                    <input type="file"  id="file"  style={{display:"none"}} onChange={handleAvatar}/>
                    <input type="text" name="username" placeholder='Username' id="" />
                    <input type="text" name="email" placeholder='Email' id="" />
                    <input type="password" name="password" placeholder='Password' id="" />
                    <button disabled={loading}>{loading ? "Loading" :"Sign In"}</button>
                </form>
            </div>
        </div>
    );
}

export default Login;