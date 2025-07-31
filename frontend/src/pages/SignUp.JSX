import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";


const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(username, email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5"
      style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/bg.png')",

      }}
    >
      <div className="max-w-[450px] w-full bg-black/60 bg-opacity-75 rounded px-8 py-14 mx-auto mt-8">
        <h1 className="text-4xl font-mediumfont-serif text-[#e1b797] mb-7">Sign Up</h1>

        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full Name"
            className="w-full h-[50px] bg-[#190f07] text-[#e1b797] rouded px-5 text-xl"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMail ID"
            className="w-full h-[50px] bg-[#190f07] text-[#e1b797] rouded px-5 text-xl"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-[50px] bg-[#190f07] text-[#e1b797] rouded px-5 text-xl"
          />

          {error && <p className="text-[#e1b797]">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-56 bg-[#e1b797]/50 text-white py-2 rounded text-base hover:opacity-90 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-10 text-[#b16b34] text-sm">
          <p>
            Already have an account?
            <span
              onClick={() => navigate("/signin")}
              className="text-[#e1b797] font-medium cursor-pointer ml-2 hover:underline"
            >
              Sign In Now
            </span>
          </p>
        </div>
      </div>

    </div>
     </>
  );
 
};


export default SignUp;