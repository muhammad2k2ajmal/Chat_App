import React, {useContext, useRef, useState} from 'react'
import "./LeftSidebar.css"
import assets from '../../assets/assets'
import {useNavigate} from "react-router-dom";
import {collection, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import { db } from '../../config/firebase';
import {AppContext} from "../../context/AppContext.jsx";
import {c} from "vite/dist/node/types.d-aGj9QkWt.js";

export const LeftSidebar = () => {
  const navigate = useNavigate();
  const {userData}= useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const inputHandler=async (e)=>{
    try {
        const input =e.target.value;
        // console.log("Input value:", input);//yes it taking the input from input feild and storing it also
        if (input){
            setShowSearch(true);
            const userRef =collection(db,'users');
            // console.log(db._databaseId);// yes db is working properly

            const q= query(userRef,where("username","==",input.toLowerCase()));
            console.log("q",q);

            const querySnap = await getDocs(q);

            if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
                //i am unable to get inside the if block bcz querysnap is empty and i dont know why
                console.log(querySnap.docs[0].data());
                setUser(querySnap.docs[0].data());
            }
            else {
                setUser(null);
            }
        }
        else{
            setShowSearch(false);
        }


    }catch (error){
      console.log(error);
    }
  }

  const addChat= async ()=>{
        const messagesRef=collection(db,'messages');
        const chatRef = collection(db,'chats');
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef,{
                createdAt:serverTimestamp(),
                messages:[]
            })
            await updateDoc(doc(chatRef,userData.id),{
                chatData:arrayUnion({
                    messageId:newMessageRef.id,
                    lastMessage:"",
                    rId:user.Id,
                    updatedAt:Date.now(),
                    messageSeen:true
                })
            })
        }catch (error){
            console.log(error);
        }

  }

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={()=>navigate('/profile')}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search Here ' />
        </div>
      </div>
      <div className="ls-list">
          {showSearch && user
          ? <div onClick={addChat} className='friends add-user'}>
                  <img src={user.avatar} alt="" />
                  <p>{user.name}</p>
              </div>
              :Array(12).fill("").map((item,index)=>(
                  <div key={index} className="friends">
                      <img src={assets.profile_img} alt="" />
                      <div>
                          <p>Muhammad</p>
                          <span>Hello How are you?</span>
                      </div>
                  </div>
              ))
          }

      </div>
    </div>
  )
}
