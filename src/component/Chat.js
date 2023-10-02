import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import InsertEmoticonTwoToneIcon from '@mui/icons-material/InsertEmoticonTwoTone';
import InsertLinkTwoToneIcon from '@mui/icons-material/InsertLinkTwoTone';
import MicTwoToneIcon from '@mui/icons-material/MicTwoTone';
import './chat.css';
import { useParams } from 'react-router-dom';
import db from '../firebase';
import firebase from 'firebase/compat/app';
import {  Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { storage } from '../firebase';
import { DialogContentText } from '@mui/material';
import { ref, uploadBytes,getDownloadURL,uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { motion, Variants} from "framer-motion";
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { doc, getDocs,collection} from "firebase/firestore";

 const Chat=({user})=> {


    // /fetch room id 
    const{roomId}= useParams();
    

    const[roomName,setroomName]=useState('');

    const[input,setInput]=useState('');

    const[seed,setSeed]=useState("");



    //send message
    const[messages,setMessages]=useState([]);

    const [active, setActive] = React.useState(false);

    const[showuserList,setShowUserList]=React.useState(false);

    function toggleUserList(){
        setShowUserList(!showuserList);
    }


    const container: Variants = {
        active: {
        background: "#ff00b1"
        },
        disabled: {
        background: "#0D00FF"
        }
    };

    const glowVariants = {
        initial: {
        opacity: 0
        },
        hover: {
        opacity: 1
        }
  }






    //emoji
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);



     //dialog box to send files
    const [openDialog, setOpenDialog] = useState(false);


    // send files
    const [selectedFile, setSelectedFile] = useState(null);

 

    useEffect(() => {
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                    setroomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection('message').orderBy('timestamp','asc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc=>doc.data()))
            })
        }
    },[roomId])


    const textInput = (e) => {
        setInput(e.target.value);
    }


    const sendMessage = (e) => {
        e.preventDefault();
        if(input===''){
            return alert('Please Enter Message');
        }
        db.collection('rooms').doc(roomId).collection('message').add({
            name:user.displayName,
            message:input,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setInput('');
    }



    

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    },[])


    // emoji hide & show
    function toggleEmojiPicker() {
        setOpenEmojiPicker(!openEmojiPicker);
  }





    // show dialog box
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    // select first file
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };


    const handleSendMessage = async (e) => {

        e.preventDefault();

        if (!input && !selectedFile) {
            return;
        }

        if (selectedFile) {
            const storageRef = ref(storage, `files/${selectedFile.name + v4()}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed', 
            (snapshot) => {
                return snapshot;
            }, 
            (error) => {
                
                console.log(error);
            }, 
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

                db.collection('rooms')
                .doc(roomId)
                .collection('message')
                .add({
                    name: user.displayName,
                    fileUrl: downloadUrl,
                    fileName: selectedFile.name, // Store the file name
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
                setInput('');
                handleCloseDialog();
                setSelectedFile(null);
            }
            );
        }

            if (input) {
                sendMessage(e);
            }
        };


        //add emoji in input text 
        function handleEmojiSelect(e) {
            let sym = e.unified.split("-");
            let codesArray = [];
            sym.forEach((el) => codesArray.push("0x" + el));
            let emoji = String.fromCodePoint(...codesArray);
            setInput((currentText) => currentText + emoji);
        }


    //         const sendMessage = (e) => {
    //     e.preventDefault();
    //     if(input===''){
    //         return alert('Please Enter Message');
    //     }
    //     db.collection('rooms').doc(roomId).collection('message').add({
    //         name:user.displayName,
    //         message:input,
    //         timestamp:firebase.firestore.FieldValue.serverTimestamp()
    //     });
    //     setInput('');
    // }

  const collectionName = 'rooms'; // Replace with your collection name

  try {
    const querySnapshot = getDocs(collection(firebase.firestore, collectionName));

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("doc",doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
  }

  // ... rest of your component


  return (
    <div className='chat'>

        {/*Chat Header*/}
        
        <div className='chat-header'>

            <Avatar src={`https://api.dicebear.com/api/human/${seed}.svg`}/>

            <div className='chat-headerInfo'>
                <h3>{roomName}</h3>
        {
                messages.length > 0 && (
                <>
                <p>
                    Last Seen{" "}
                    {new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}  
                </p>

            </>
                )
        }
        </div>



            <div className='header-right'>
                <IconButton><SearchTwoToneIcon/></IconButton>
                <IconButton><AttachFileTwoToneIcon/></IconButton>
                <IconButton><MoreVertTwoToneIcon/></IconButton>
            </div>
        </div>



        {/*Chat Body*/}

    <motion.div
      variants={container}
      initial='intial'
      whileHover="hover"
      animate={active ? "active" : "disabled"}
      onClick={() => setActive(!active)}
      className="container chat-body"
    >
        <motion.div variants={glowVariants} className="glow">
        {
        messages.map((message,index) => (
            <div key={index}  className={`chat-message ${message.name === user.displayName && 'chat-receiver'}`}>

            
                <span className='chat-name'>
                    {message.name}
                </span>

                


                {message.message && <p>{message.message}</p>}
                <span className='send_content'>
                    {message.imgUrl && <img style={{ width: "100%", height: "auto", objectFit: "cover" }} src={message.imgUrl} alt='Uploaded' />}
                    {message.fileUrl && (
                        <a href={message.fileUrl} target='_blank' rel='noopener noreferrer'>
                            {message.fileName}
                        </a>
                    )}
                    {message.audioUrl && (
                        <audio controls>
                            <source src={message.audioUrl} type='audio/mpeg' />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                    {message.videoUrl && (
                        <video controls>
                            <source src={message.videoUrl} type='video/mp4' />
                            Your browser does not support the video element.
                        </video>
                    )}
                </span>

                {/*TimeStamp */}
                <span className='chat-time'>
                    {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}
                </span>
                
            </div>
            ))
        }
        </motion.div>
        </motion.div>





        {/*Chat Footer*/}
    <div className='chat-footer'>


    <InsertEmoticonTwoToneIcon onClick={toggleEmojiPicker} />


    <RecentActorsIcon onClick={toggleUserList}/>
 
        
        

      <InsertLinkTwoToneIcon onClick={handleOpenDialog} />


      <form onSubmit={handleSendMessage} className='chat-form'>
        <div className="emoji-picker" style={openEmojiPicker ? { display: "block" } : { display: "none" }}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
        <input
          type='text'
          value={input}
          placeholder='Type your Message'
          onChange={textInput}
        />
        <input type='submit'/>
      </form>


      <MicTwoToneIcon />



    <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          {/* Include your file input here */}
          <input type='file' onChange={handleFileSelect}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type='submit' onClick={handleSendMessage}>Send</Button>
        </DialogActions>
      </Dialog>


        </div>
    </div>
  )
}


export default Chat;