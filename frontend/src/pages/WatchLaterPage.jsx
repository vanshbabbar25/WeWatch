import { useEffect, useState } from "react";
import { getWatchLater } from "../api/watchLaterApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const WatchLaterPage = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getWatchLater();
                setMovies(res.data.list || []);
            } catch (error) {
                console.error("Failed to fetch watch later list:", error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-[#392211] flex flex-col">
            <Navbar />

            <div className="flex-grow p-8 max-w-7xl top-18 mx-auto w-full">
                <h1 className="text-3xl pt-[70px] font-bold font-serif text-white mb-8 border-b border-[#784923] pb-4">
                    Your Watch Later List
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-[#e1b797] text-xl animate-pulse">Loading your list...</span>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-300 text-xl mb-6">Your watch later list is empty.</p>
                        <Link to="/" className="bg-[#784923] hover:bg-[#9a5e2f] text-white px-8 py-3 rounded-full transition-colors duration-300 font-semibold shadow-lg">
                            Explore Movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <Link to={`/movie/${movie.movieId}`} key={movie.movieId}>
                                <div className="bg-[#232323] rounded-xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300 group cursor-pointer h-full flex flex-col border border-transparent hover:border-[#784923]">
                                    <div className="relative aspect-[2/3] w-full overflow-hidden">
                                        {movie.poster ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#181818] flex items-center justify-center text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="p-4 flex-grow flex items-center justify-center bg-gradient-to-b from-[#232323] to-[#1a1a1a]">
                                        <h3 className="text-sm md:text-base font-semibold text-gray-200 truncate w-full text-center group-hover:text-white transition-colors">
                                            {movie.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default WatchLaterPage;