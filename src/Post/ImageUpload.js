import React, {useState} from 'react'
import { Button } from '@material-ui/core';
import { storage, db} from '../firebase';
import firebase from "firebase";

import './ImageUpload.css';

function ImageUpload( {userName}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setprogress] = useState(0);

    const handleChange = (event) => {
        if(event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );

                setprogress(progress);
            },
            (error) => {
                //Error Function....
                console.log(error);
                alert(error.message);
            },
            (success) => {
                //complete function.....
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post image inside db..
                    console.log('Passed'+ userName);
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        userName: userName
                    })

                    console.log('Failed');
                })
            }
        )
    }

    return (
        <div className= "ImageUpload">
            <progress className="ImageUpload_progress" value={progress} max="100" />
            <input 
                type="text" 
                placeholder="Enter a caption..." 
                value={caption}
                onChange={event => setCaption(event.target.value)}/>

            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
