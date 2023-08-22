import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import'./sidebar.css';
import db from '../firebase.js';
import {Link} from 'react-router-dom';




export default function SidebarChat({id,name,addnewChat}) {

    const[seed,setSeed]=useState("");

    const [lastmsg, setlastmsg] = useState('');    

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));

        db.collection('rooms').doc(id).collection('message').orderBy('timestamp','desc').onSnapshot(snapshot=>
            setlastmsg(snapshot.docs.map(doc=>doc.data())))
    },[])


    console.log(lastmsg);


    // Create Room 
    const createChat = () => {
        const room=prompt('Enter Room Name');
        if(room){
            db.collection('rooms').add({
                name:room
            })
        }
    }


    

  return (
            addnewChat ? (
                
                    <div className='sidebar-chat' onClick={createChat}>
                        <h2>Add New Chat</h2>
                    </div>
            ) : (
                <Link to={`/room/${id}`}>
                    <div className='sidebar-chat'>
                        <Avatar src={`https://api.dicebear.com/api/human/${seed}.svg`}/>
        
                        <div className='sidebar-chatinfo'>
                            <h2>{name}</h2>
                            <p>{lastmsg[0]?.message}</p>
                        </div>
                    </div>
                
                </Link>

            ) 
        

  )
}
