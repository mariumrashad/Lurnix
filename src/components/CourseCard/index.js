import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useWishlist } from "../../App"; 
import { useAuth } from "../../context/AuthContext"; 

const CourseCard = ({ course, isWishlistPage = false }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const isWishlisted = isInWishlist(course.id);
  const isLoggedIn = !!currentUser; 

  const checkEnrollment = () => {
    const enrolledIds = JSON.parse(localStorage.getItem("enrolled_courses")) || [];
    
    return enrolledIds.map(String).includes(course.id.toString());
  };

  const isEnrolled = checkEnrollment();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      localStorage.setItem("pending_wishlist_course", JSON.stringify(course));
      
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    toggleWishlist(course);
  };

  const handleEnrollClick = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/checkout/${course.id}` } });
      return;
    }

    navigate(`/checkout/${course.id}`);
  };

  return (
    <div className="bg-white dark:bg-[#0c111d] shadow-lg rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.02] group">
      
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {!isEnrolled && (
          <button
            onClick={handleToggle}
            className="absolute top-3 right-3 bg-white/70 dark:bg-dark/60 p-2.5 rounded-full backdrop-blur-md transition-all hover:bg-white dark:hover:bg-dark shadow-sm group/heart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#ff4b4b" : "none"}
              stroke={isWishlisted ? "#ff4b4b" : "currentColor"}
              strokeWidth="2"
              className={`transition-all duration-300 ${isWishlisted ? "scale-110" : "text-gray-700 dark:text-gray-200 group-hover/heart:text-red-500"}`}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}

        <div className="absolute bottom-3 right-3 bg-primary px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
          {course.level}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-bold text-lg text-black dark:text-white leading-tight line-clamp-2 flex-1">
            {course.title}
          </h3>

          <div className="flex flex-col items-end shrink-0 group/price">
            <div className="flex items-baseline gap-0.5 text-primary">
              <span className="text-sm font-bold">$</span>
              <span className="text-3xl font-black tracking-tighter">
                {course.price ? course.price.toString().replace('$', '') : '0.00'}
              </span>
            </div>
            <div className="h-[2px] w-8 bg-gradient-to-l from-primary to-transparent mt-1 rounded-full transition-all group-hover:w-full opacity-40"></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-gray-500 dark:text-gray-400 text-xs mb-6">
          <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
            <span className="text-yellow-600 dark:text-yellow-500 font-bold">⭐ {course.rating}</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span className="opacity-70 text-base">👥</span> {course.students}
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span className="opacity-70 text-base">⏱️</span> {course.duration}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-[1.2rem] mb-6 border border-gray-100 dark:border-gray-800/50">
          <p className="text-[9px] text-gray-400 uppercase font-black mb-1 tracking-widest">Next Lesson</p>
          <p className="text-sm font-bold text-black dark:text-white truncate">
            {course.nextLesson}
          </p>
        </div>

        <div className="flex gap-3 mt-auto">
          <Link 
            to={`/course/${course.id}`}
            className="flex-1 py-3 px-4 border-2 border-primary/10 text-primary rounded-xl font-bold text-sm text-center transition-all hover:bg-primary/5 hover:border-primary"
          >
            Details
          </Link>

          {isEnrolled ? (
            <Link
              to="/my-courses"
              className="flex-[1.5] py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm text-center transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-1"
            >
              <span>✓ Muted (My Course)</span>
            </Link>
          ) : !isLoggedIn ? (
            <button 
              onClick={handleEnrollClick}
              className="flex-[1.5] py-3 px-4 bg-red-500 text-white rounded-xl font-bold text-sm text-center transition-all hover:bg-red-600 shadow-lg shadow-red-500/20"
            >
              Login to Buy
            </button>
          ) : (
            <button 
              onClick={handleEnrollClick}
              className="flex-[1.5] py-3 px-4 bg-primary text-white rounded-xl font-bold text-sm transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;