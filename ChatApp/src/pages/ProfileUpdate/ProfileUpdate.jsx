import React, {useContext, useEffect, useState} from "react"
import './ProfileUpdate.css'
import assets from "../../assets/assets"
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../../config/firebase.js";
import {doc, getDoc, updateDoc,} from "firebase/firestore";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Upload from "../../lib/upload.js";
import {AppContext} from "../../context/AppContext.jsx";

const ProfileUpdate = () => {
    const navigate=useNavigate();
    const [image,setImage] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUid] = useState("");
    const [prevImg,setPrevImg] = useState("");
    const {setUserData} = useContext(AppContext);
    const profileUpdate=async (event)=>{
        event.preventDefault();
        try {
            if (!prevImg && !image){
                toast.error("Upload profile image")
            }
            const docRef=doc(db,'users',uid);
            if (image){
                const imgUrl=await Upload(image);
                setPrevImg(imgUrl);
                await updateDoc(docRef,{
                    avatar:imgUrl,
                    bio:bio,
                    name: name
                })
            }
            else {
                await updateDoc(docRef,{
                    bio:bio,
                    name: name
                })

            }
            const snap = await getDoc(docRef);
            setUserData(snap.data());
            navigate('/chat')
        }catch (error){
            console.log(error);
            toast.error(error.message);
        }
    }
    useEffect(()=>{
        onAuthStateChanged(auth,async (user)=>{
            if (user){

                setUid(user.uid);
                const docRef = doc(db,'users',uid);
                const docSnap =await getDoc(docRef);
                if (docSnap.data().name) {
                    setName(docSnap.data().name);
                }
                if (docSnap.data().bio) {
                    setBio(docSnap.data().bio);
                }
                if (docSnap.data().avatar) {
                    setPrevImg(docSnap.data().avatar);
                }
            }
            else{
                navigate('/');
            }
        })
    })
    return (
        <div className="profile">
            <div className="profile-container">
                <form action="" onSubmit={profileUpdate}>
                    <h3>Profile Details</h3>
                    <label htmlFor="avatar">
                        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg,.jpeg" hidden/>
                        
                        <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
                        
                         upload profile pic
                    </label>
                    <input type="text" placeholder="Your Name" onChange={(e)=>setName(e.target.value)} value={name} required />
                    <textarea placeholder="Write profile bio" onChange={(e)=>setBio(e.target.value)} value={bio} required></textarea>
                    <button type="submit">Save</button>
                </form>
                <img className="profile-pic" src={image? URL.createObjectURL(image) :prevImg?prevImg :assets.logo_icon} alt="" />
            </div>
                
        </div>
    )
}


export default ProfileUpdate
