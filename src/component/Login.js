import React from 'react'
import './login.css';
import { auth, providerGoogle,providerFB} from '../firebase';


export default function Login({setUser}) {

    const SignInwithGoogle = () => {
        auth
        .signInWithPopup(providerGoogle)
        .then((result) => 
        {
            sessionStorage.setItem('user',JSON.stringify(result.user));
            setUser(result.user);
        })
        .catch((err)=> alert(err.message));
        }


    const SignInwithFB = () => {
        auth
        .signInWithPopup(providerFB)
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
            <h2>Google Login</h2>
            <button onClick={SignInwithGoogle}>Login with Gmail</button>
            <h2>FB Login</h2>
            <button onClick={SignInwithFB}>Login with FB</button>
        </div>
    </div>
  )
}
