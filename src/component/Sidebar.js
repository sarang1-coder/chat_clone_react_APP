import React, { useEffect, useState } from 'react';

// Import Avatar 
import {Avatar, IconButton} from '@material-ui/core';


// Import Icons 
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Import css 
import './sidebar.css';
import SidebarChat from './SidebarChat';

// import DB 
import db from '../firebase.js';




export default function Sidebar({setUser,user}) {

  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    db.collection('rooms').onSnapshot(snapshot => {
      setRooms(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }, []);

  const filteredRooms = rooms.filter((room) => {
    return room.data.name.toLowerCase().includes(search.toLowerCase());
  });

  const logout = () => {
    sessionStorage.setItem('user', '');
    setUser('');
  }

  return (
    <div className='sidebar'>

      {/*Header*/}
      <div className='sidebar-header'>

        <Avatar src={user.photoURL} />

        <div className='sidebar-headerRight'>
          <IconButton><DonutLargeRoundedIcon /></IconButton>
          <IconButton><ChatTwoToneIcon /></IconButton>
          <IconButton><MoreVertTwoToneIcon /></IconButton>
          <IconButton> <ExitToAppIcon onClick={() => logout()} /></IconButton>
        </div>
      </div>


      {/*Search*/}
      <div className='sidebar-search'>
        <div className='sidebar-searchContainer'>
          <SearchTwoToneIcon />
          <input type='text'
            placeholder='Search or Start New Chat'
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
          />
        </div>
      </div>


      {/*Chat section*/}
      <div className='sidebar-Chat'>
        <SidebarChat addnewChat />
        {filteredRooms.map((room) => (
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            email={room.data.email}
          />
        ))}
      </div>

    </div>
  )
}
