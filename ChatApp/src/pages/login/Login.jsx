import React, { useState } from "react"
import './Login.css'
import assets from '../../assets/assets'
import { signup  ,login} from "../../config/firebase"
import { signOut } from "firebase/auth"
const Login = () => {
    const [currState,setCurrState] = useState("Sign Up");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const onSubmitHandler = (event) =>{
        event.preventDefault();
        if(currState==="Sign Up"){
            signup(username,email,password);
        }
        else{
            login(email,password);
        }
    }
    return (
       <div className="login">
        <img src={assets.logo_big} alt="" />
        <form  className="login-form" onSubmit={onSubmitHandler}>

            <h2>{currState}</h2>

            {currState === "Sign Up"?<input onChange={(e)=>setUsername(e.target.value)} value={username} type="text" placeholder="username"  className="form-input" required />:null}
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email address" className="form-input" required />
            <input onChange={(e)=> setPassword(e.target.value)} value={password} type="password" placeholder="password"  className="form-input" required />

            <button type="submit">{currState=== "Sign Up"?"Create Account":"Login"}</button>

            <div className="login-term">
                <input type="checkbox" />
                <p>Agree to term of use & privacy policy.</p>


            </div>

            <div className="login-forgot">
                {    currState === "Sign Up"?
                                        <p className="login-toggle">Already have an Account <span onClick={()=>setCurrState("Login")} > Login Here</span></p> :
                                        <p className="login-toggle">Don't have an Account <span onClick={()=>setCurrState("Sign Up")} > Click Here</span></p>

                }
            </div>
        </form>
       </div>
    )
   
}

export default Login
