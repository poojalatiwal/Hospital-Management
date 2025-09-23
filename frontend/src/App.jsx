import React, { useContext, useEffect } from "react";
import "./App.css";
import {BrowserRouter as Router,Route,Routes}  from "react-router-dom"
import Appointment from "./pages/Appointment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Home from "./pages/home";
import { ToastContainer} from 'react-toastify';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Context } from "./main";
import axios from "axios";

const App = () =>{
  const {isAuthenticated,setIsAuthenticated,setUser} = useContext(Context);
  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        const response = await axios.get(" http://localhost:4000/api/v1/user/patient/me",{withCredentials:true});
        setIsAuthenticated(true);
        setUser(response.data.user)

      }catch(error){
        setIsAuthenticated(false)
        setUser({})

      }
    };
    fetchUser();
  },[isAuthenticated])
  return (
    
    <div>
      <>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/appointment" element={<Appointment/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/about" element={<About/>}/>
          </Routes>
          <Footer/>
          <ToastContainer position="top-center"/>
        </Router>
      </>

    </div>
  )
}
export default App;