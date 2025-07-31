import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { message } = await login(username, password);
      toast.success(message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-10"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/bg.png')",

      }}
    >  
      <div className="max-w-[450px] w-full bg-black/60 rounded px-8 py-14 mx-auto mt-8">
        <h1 className="text-4xl font-medium font-serif text-[#e1b797] mb-7">Sign In</h1>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="w-full h-[50px] bg-[#190f07] text-[#e1b797] rouded px-5 text-xl"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full h-[50px] bg-[#190f07] text-[#e1b797] rouded px-5 text-xl"
          />

          {error && <p className="text-[#e1b797]">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-56 bg-[#e1b797]/50 text-white py-2 rounded text-base hover:opacity-90 cursor-pointer"
          >
            Sign In
          </button>
        </form>
        {isLoading && (<div className="text-[#e1b797]">signing...</div>)}

        <div className="mt-10 text-[#b16b34] text-sm">
          <p>
            New to WeWatch?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#e1b797] font-medium cursor-pointer ml-2 hover:underline"
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignIn;