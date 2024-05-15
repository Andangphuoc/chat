import logo from './logo.svg';
import './App.css';
import List from './components/list';
import Chat from './components/chat';
import Detail from './components/detail';
import Login from './components/login';
import Notifycation from './components/notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/useStore';
import { useChatStore } from './lib/chatStore';


function App() {
  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  const {chatId} = useChatStore()
  
  useEffect(()=> {
      const unSub = onAuthStateChanged(auth,(user) =>
      {
        fetchUserInfo(user?.uid);
      })
    return ()=>{
      unSub();
    }
    },[fetchUserInfo])                            
    

  if(isLoading) return <div className='loading'>Loading...</div>
  return (
  <div className='container'>
        {currentUser ? (
          <>
            <List></List>
            { chatId && <Chat></Chat>}
            { chatId  && <Detail></Detail>}
          </>
        ): (<Login/>) }
        <Notifycation></Notifycation>
  </div>
  );
}

export default App;
