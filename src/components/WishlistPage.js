import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWishlist } from "../App"; 
import { useAuth } from "../context/AuthContext";

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist(); 
  const { currentUser } = useAuth();
  const location = useLocation();

  const isLoggedIn = !!currentUser; 

  const handleScrollToCourses = () => {
    setTimeout(() => {
      const element = document.getElementById("courses");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F9FF] dark:bg-[#060912] relative overflow-hidden">
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-10">
          <div>
            <h1 className="text-5xl font-black text-dark dark:text-white tracking-tight">
              My Favorites <span className="text-primary italic">.</span>
            </h1>
            <p className="text-gray-400 mt-3 font-medium text-lg">Your curated collection of future skills</p>
          </div>
          
          <Link 
            to="/#courses" 
            onClick={handleScrollToCourses}
            className="group flex items-center gap-2.5 text-primary font-bold hover:opacity-80 transition-all bg-white dark:bg-dark p-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <span>Discover Courses</span>
            <svg className="group-hover:translate-x-1.5 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="relative py-28 flex items-center justify-center">
            
            <div className="absolute -inset-10 z-0">
              <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400/30 dark:bg-orange-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-[60px] animate-blob"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-[60px] animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-[70px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 text-center py-20 px-10 max-w-xl bg-white/60 dark:bg-[#0c111d]/70 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-primary/5 border border-white/20 dark:border-gray-800/50 flex flex-col items-center">
              
              <div className="relative mb-10">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-80"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-3xl flex items-center justify-center shadow-lg relative z-10">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-dark dark:text-white mb-4 tracking-tight leading-tight">
                Your <span className="text-primary"> Wishlist</span> is Empty
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm font-medium">
                Add courses you're interested in to build your dream curriculum and track your next learning goals.
              </p>
              
              <Link 
                to="/#courses" 
                onClick={handleScrollToCourses}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest border border-primary hover:border-white/20"
              >
                Explore The Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {wishlist.map((course) => (
              <div key={course.id} className="group bg-white dark:bg-[#0c111d] rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 border border-gray-50 dark:border-gray-800/80 transition-all hover:shadow-2xl hover:shadow-primary/5">
                
                <div className="relative w-full md:w-80 h-52 shrink-0 overflow-hidden rounded-[1.8rem]">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark/90 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm">
                    {course.level}
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-dark dark:text-white leading-tight transition-colors group-hover:text-primary flex-1 pr-4">
                        {course.title}
                      </h3>
                      <button onClick={() => toggleWishlist(course)} className="bg-red-50 dark:bg-red-500/10 p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-white transition-all shadow-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                      <span>⭐ {course.rating}</span>
                      <span>👥 {course.students}</span>
                      <span>⏱️ {course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="text-3xl font-black text-dark dark:text-white tracking-tighter">
                      {course.price}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link to={`/course/${course.id}`} className="px-6 py-3 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
                        View Details
                      </Link>
                      
                      {!isLoggedIn ? (
                        <Link 
                          to="/login" 
                          state={{ from: location.pathname }} 
                          className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 hover:scale-105 transition-all text-center"
                        >
                          Login to Buy
                        </Link>
                      ) : (
                        <Link
                          to={`/checkout/${course.id}`}
                          className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:scale-105 transition-all text-center"
                        >
                          Enroll Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;