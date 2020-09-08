import React, { useState, useEffect } from 'react';

import HyieeBuddyImage from './Logo/hyiee-buddy.png'
import './App.css';
import Post from './Post/Post';
import { db, auth } from './firebase';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './Post/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false)

  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has loggedIn ...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //dont update username
        }
        else {
          return authUser.updateProfile({
            displayName: username
          });
        }

      }
      else {

        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);


  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
    setOpen(false);
  }
  console.log("-------------------");
  console.log(user);

  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >

        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={HyieeBuddyImage}
                alt="Hyiee-budd"
              />
            </center>

            {openSignIn ? null : (
              <Input
                placeholder="UserName"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {openSignIn ? (
              <Button type="submit" onClick={signIn}>Sign In</Button>
            ) : (
                <Button type="submit" onClick={signUp}>Sign Up</Button>
              )

            }


          </form>

        </div>
      </Modal>

      <div className="aap__header">
        <img
          className="app__headerImage"
          src={HyieeBuddyImage}
          alt="Hyiee-budd" />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => { setOpenSignIn(true); setOpen(true) }}>SignIn</Button>
              <Button onClick={() => setOpen(true)}>SignUp</Button>
            </div>

          )}
      </div>

      <div className="app__posts">
        <div className="app__postLeft">
          {
            posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                user={user}
                imageUrl={post.imageUrl}
                userName={post.userName}
                caption={post.caption}
              />
            ))
          }
        </div>

        <div className="app_postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            maxWidth= {100}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>

      </div>



      {user?.displayName ? (
        <ImageUpload userName={user.displayName} />
      ) : (
          <h3>You need To Login for upload</h3>
        )}

    </div>
  );
}

export default App;