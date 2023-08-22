import React from 'react'
import './login.css';
import { auth, provider } from '../firebase';


export default function Login({setUser}) {

    const SignIn = () => {
        auth
        .signInWithPopup(provider)
        .then((result) => 
        {
            sessionStorage.setItem('user',JSON.stringify(result.user));
            setUser(result.user);
        })
        .catch((err)=> alert(err.message));
        }
    

  return (
    <div className='login-wrapper'>
        <div className='login'>
            <img src='https://www.freeiconspng.com/uploads/live-chat-icon-19.png' alt='img'/>
            <h2>Sign in to ChatApp</h2>
            <button onClick={SignIn}>Login with Gmail</button>
           

        </div>
    </div>
  )
}
