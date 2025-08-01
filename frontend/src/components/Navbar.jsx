import { HelpCircle, LogOut, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [movieName, setMovieName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.username
      )}&backgroundColor=transparent`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };

  const searchmovie = async () => {
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieName)}&include_adult=false&language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGNjOTc0YzVmOTZkZGU3Y2RkZDcxM2FlM2ZhNDIzYiIsIm5iZiI6MTc1MjMwNDExNS4yOTUsInN1YiI6IjY4NzIwOWYzMjc1YmI0NmVlZTZlOWUwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Pq2LSFZQijzrDADsoXvWEJlTY2E5Hsd6NT3k4zBXRaQ', 
        },
      };

      const res = await fetch(url, options);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const movieId = data.results[0].id;
        navigate(`/movie/${movieId}`);
      } else {
        toast("This movie is not available");
        console.log('No movie found.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-[#201309] text-gray-200 flex flex-col md:flex-row justify-between items-center p-4 px-10 space-y-4 md:space-y-0 text-sm md:text-base font-medium">
      <Link to={"/"}>
        <img
          src="/logo.png"
          alt="Logo"
          className="w-14 rounded-full cursor-pointer brightness-125"
        />
      </Link>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!movieName.trim()) return;
          searchmovie();
        }}
        className="flex flex-wrap gap-2 items-center justify-center"
      >
        <input
          type="text"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          placeholder="Movie"
          className="h-9 w-full max-w-xs sm:w-72 px-4 rounded-2xl bg-[#5b371a] text-[#e1b797] text-base"
        />
        <button
          type="submit"
          className="h-9 bg-[#e1b797]/50 rounded-2xl px-4 text-white text-base hover:opacity-90 cursor-pointer"
        >
          search <i className="fa-brands fa-searchengin"></i>
        </button>
      </form>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative">
        <Link to={user ? "ai-recommendations" : "signin"}>
          <button className="bg-[#784923] px-7 py-2 text-white cursor-pointer rounded-2xl">
            Get AI Recommendations
          </button>
        </Link>

        {!user ? (
          <Link to={"/signin"}>
            <button className="border border-[#333333] bg-[#784923] rounded-2xl py-2 px-3 cursor-pointer">
              <i className="fa-regular fa-user px-2"></i>
              Sign In
            </button>
          </Link>
        ) : (
          <div className="text-white">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 bg-[#5f391c] rounded-full border-2 border-black cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#26170b] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#190f07] hover:bg-[#060402] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#190f07] hover:bg-[#060402] gap-3 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#190f07] hover:bg-[#060402] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
