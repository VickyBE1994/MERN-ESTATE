
import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import OAuth from "../Components/OAuth";

const Signup = () => {

  const [formData, setFormData] = useState({});
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  
  };
  const handleSubmit = async (e) => {
      e.preventDefault()

      try {
        setLoading(true)
        const res = await fetch('/api/auth/signup',
          {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
       });
       const data = await res.json();
   
      if (data.succuss === false){
        setLoading(false)
       setError(data.message)
       return
      }
      setLoading(false)
      setError(null)
      navigate("/signin")
      } catch (error) {
        setLoading(false)
        setError(error.message)
      }
   
      // console.log(data);
  };
   // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-3 rounded-lg "
          id="username"
          type="text"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg "
          id="email"
          type="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg "
          id="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button disabled={loading} 
        className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
     {
      loading ? 'loading':'sign up'
     }
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Have an account</p>
        <Link to={"/signin"}>
          <span className="text-blue-700">sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default Signup;
