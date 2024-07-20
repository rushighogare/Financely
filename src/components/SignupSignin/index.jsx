import React, { useState } from "react";
import "./styles.css";
import Input from "../Input"
import Button from "../Button";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

function SignupSigninComponent(){
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const [loginForm, setLoginForm]=useState(false);
    const [loading, setLoading]=useState(false);
    const navigate=useNavigate();

    function signupWithEmail(){
        setLoading(true);
        console.log("Name", name);
        console.log("email", email);
        console.log("password", password);
        console.log("confirmPassword", confirmPassword);
        //authenticate the user or basically create a new account using email and pass
        
        if(name!="" && email!="" && password!="" && confirmPassword!=""){
            if(password==confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;
                        console.log("User>>", user);
                        toast.success("User created successfully");
                        setLoading(false);
                        setName("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        // Create a doc with user id as the following id
                        createDoc(user);
                        navigate("/dashboard");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage);
                        setLoading(false);
                        // ..
                    }
                );
            }
            else{
                toast.error("Password and Confirm Password doesn't match")
                setLoading(false);
            }
        }
        else{
            toast.error("All fields are mandatory");
        }
    }

    async function createDoc(user){
        setLoading(true);
        //make sure that doc with same uid doesn't exist 
        //create a doc
        if(!user) return;

        const userRef=doc(db, "users", user.uid);
        const userData=await getDoc(userRef);
        if(!userData.exists()){
            try{
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                setLoading(false);
                toast.success("Doc created");   
            }catch(e){
                setLoading(false);
                toast.error(e.message);
            }
        }else{
            setLoading(false);
            toast.error("Doc already exists");
        }
    }

    function googleAuth(){
        setLoading(true);
        try{
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("User>>", user);
                createDoc(user);
                setLoading(false);
                navigate("/dashboard");
                toast.success("User authenticated");
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage);
            });
        }catch(e){
            setLoading(false);
            toast.error(e.message);
        }
        
    }

    function LoginUsingEmail(){
        console.log("Email", email);
        console.log("Password", password);
        setLoading(true);
        if(email!="" && password!=""){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast.success("User Logged In");
                console.log("User:", user);
                setLoading(false);
                navigate("/dashboard");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage);
            });  
        }
        else{
            toast.error("All fields are mandatory");
            setLoading(false);
        }
    }

    return (
        <>
        {loginForm ? (
            <div className="signup-wrapper">
                <h2 className="title">
                    Login on <span style={{color: "var(--theme)"}}>Financely.</span>
                </h2>
                <form>
                    <Input
                    type="email"
                    label={"Email"}
                    state={email}
                    setState={setEmail}
                    placeholder={"JohnDoe@gmail.com"}
                    />
                    <Input
                    type="password"
                    label={"Password"}
                    state={password}
                    setState={setPassword}
                    placeholder={"Example@123"}
                    />
                    <Button 
                    //disable the button if loading is happening
                    disabled={loading}
                    text={loading? "Loading..." : "Login Using Email and Password"} 
                    onClick={LoginUsingEmail}
                    />
                    <p className="p-login">or</p>
                    <Button
                    onClick={googleAuth} 
                    text={loading? "Loading..." : "Login Using Google"}
                    blue={true}/>
                    <p 
                    className="p-login"
                    style={{cursor: "pointer"}}
                    onClick={()=>setLoginForm(!loginForm)}>
                        Or Don't Have An Account? Click here
                    </p>
                </form>
            </div>) 
        : (
            <div className="signup-wrapper">
                <h2 className="title">
                    Sign Up on <span style={{color: "var(--theme)"}}>Financely.</span>
                </h2>
                <form>
                    <Input
                    label={"Full Name"}
                    state={name}
                    setState={setName}
                    placeholder={"John Doe"}
                    />
                    <Input
                    type="email"
                    label={"Email"}
                    state={email}
                    setState={setEmail}
                    placeholder={"JohnDoe@gmail.com"}
                    />
                    <Input
                    type="password"
                    label={"Password"}
                    state={password}
                    setState={setPassword}
                    placeholder={"Example@123"}
                    />
                    <Input
                    type="password"
                    label={"Confirm Password"}
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    placeholder={"Example@123"}
                    />
                    <Button 
                    //disable the button if loading is happening
                    disabled={loading}
                    text={loading? "Loading..." : "Signup Using Email and Password"} 
                    onClick={signupWithEmail}
                    />
                    <p className="p-login">or</p>
                    <Button 
                    onClick={googleAuth} 
                    text={loading? "Loading..." : "Signup Using Google"}
                    blue={true}/>
                    <p 
                    className="p-login"
                    style={{cursor: "pointer"}}
                    onClick={()=>setLoginForm(!loginForm)}>
                        Or Have An Account Already? Click here
                    </p>
                </form>
            </div>
         ) }
        </>
    );
}

export default SignupSigninComponent;