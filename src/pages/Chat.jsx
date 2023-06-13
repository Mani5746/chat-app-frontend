import React, { useState, useEffect,useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute,host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Logo from '../assets/logo.svg';
import Welcome from '../components/Welcome';
import ChatConatiner from '../components/ChatConatiner';
import {io} from "socket.io-client";

function Chat() {
 const socket = useRef();


  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded,setIsLoaded]=useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate('/login');
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
        setIsLoaded(true)
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);



  useEffect(() => {
    const fetchdata = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate('/setAvatar');
        }
      }
    };

    fetchdata();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        

        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatConatiner   currentChat={currentChat}  currentUser={currentUser}  socket={socket}/>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 900px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
