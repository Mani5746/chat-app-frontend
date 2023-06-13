import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { setAvatarRoute } from '../utils/APIRoutes';
export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    const fetchdata = async () => {
      if (!localStorage.getItem('chat-app-current-user')) {
        navigate('/login');
      }
    };
    fetchdata();
  }, []);

  const setProfilePicture = async () => {
    console.log('selected avatar', avatars[selectedAvatar]);
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar', toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem('chat-app-current-user'));

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      console.log('first', data.image);
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-current-user', JSON.stringify(user));
        navigate('/');
      } else {
        toast.error('Error setting avatar. Please try again.', toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const emailHash=Math.round(Math.random() * 1000);
        const defaultImage = encodeURIComponent(
          `https://api.dicebear.com/6.x/avataaars/png/seed=${emailHash}`
        );
        console.log('default image',defaultImage)
        const gravatarImage = `https://www.gravatar.com/avatar/${emailHash}?d=${defaultImage}`;
        data.push(gravatarImage)
      }
      console.log('data',data)
      setAvatars(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? 'selected' : ''
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }

    .selected {
      border: 0.4rem solid #39ff14;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #b38947;
    }
  }
`;