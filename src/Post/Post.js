import React , { useState, useEffect } from 'react';
import { db } from '../firebase';
import firebase from 'firebase'; 
import './Post.css';
import Avatar from '@material-ui/core/Avatar';

function Post({imageUrl, user, userName, caption, postId}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe =db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(doc => doc.data()));
            })
        }


        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId)
        .collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    return (
        <div className = "post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt= "Reyhul"
                    src = "/static/images/avatar/1.jpg"
                />
                <h3>{userName}</h3>
            </div>
            
            {/* header--> avatar + username */}

            <img className = "post__image"
                src={imageUrl} 
                alt="Beach"/>
            {/* image */}

            <h4 className="post__text">
                <strong>{userName}: </strong> {caption}
            </h4>
            
            <div className="post__comments">
                {comments.map(comment => (
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                ))

                }
            </div>

            {
                user && 
                <form className="post__commentBox" action="">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={event => setComment(event.target.value)}>
                </input>
                
                <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}>
                        Post
                </button>
            </form>
            }
            
        </div>
    )
}

export default Post
