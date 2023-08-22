import Chat from './component/Chat.js';
import Sidebar from './component/Sidebar.js';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './component/Login.js';
import { useState } from 'react';


function App() {

   const[user,setUser]=useState(sessionStorage.getItem('user')
            ?JSON.parse(sessionStorage.getItem('user'))
            :''
        )

  return (

    
    <Router>
      
      {!user ? (<Login setUser={setUser}/>):(

        <div className="App">
          <div className='app-body'>

        {/* SideBar*/}

          <Sidebar setUser={setUser} user={user}/>

        {/*Chat*/} 
        <Routes>

         
        <Route 
            exact path='/'
           element={ <Chat user={user}/>}
          />
    
        <Route 
            path='/room/:roomId'
            element={<Chat user={user}/>}
            />
        
        </Routes>
      </div>
    </div>

    )}

      
    </Router>

  );
}

export default App;
