import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();

  const [email,setEmail]=useState("");

  const [password,setPassword]=useState("");

  const login=()=>{

    if(
      email==="admin@verixa.in" &&
      password==="123456"
    ){
      navigate("/admin/dashboard");
    }
    else{

      alert("Invalid Admin Login");

    }

  }

  return(

<div className="min-h-screen flex justify-center items-center bg-slate-100">

<div className="bg-white shadow-xl rounded-3xl p-10 w-[420px]">

<h1 className="text-4xl font-bold text-blue-600 text-center">

VERIXA ADMIN

</h1>

<input

type="email"

placeholder="Admin Email"

className="border w-full mt-8 p-4 rounded-xl"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>

<input

type="password"

placeholder="Password"

className="border w-full mt-5 p-4 rounded-xl"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>

<button

onClick={login}

className="bg-blue-600 w-full mt-8 py-4 rounded-xl text-white"

>

Login

</button>

</div>

</div>

  )

}

export default AdminLogin;