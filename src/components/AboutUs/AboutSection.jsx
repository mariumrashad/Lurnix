import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useWishlist } from "../../App"; 
import { useAuth } from "../../context/AuthContext";

const AboutSection = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!currentUser;

  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/recommended_courses")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch recommended courses");
        }
        return res.json();
      })
      .then((data) => {
        setRecommendedCourses(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommended courses:", err);
        setIsLoading(false);
      });
  }, []);

  const checkEnrollment = (courseId) => {
    const enrolledIds = JSON.parse(localStorage.getItem("enrolled_courses")) || [];
    return enrolledIds.map(String).includes(courseId.toString());
  };

  const handleToggle = (e, course) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      localStorage.setItem("pending_wishlist_course", JSON.stringify(course));
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    toggleWishlist(course);
  };

  const handleEnrollClick = (e, courseId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/checkout/${courseId}` } });
      return;
    }
    navigate(`/checkout/${courseId}`);
  };

  return (
    <section id="about" className="py-24 bg-[#F8F9FF] dark:bg-[#04070D] overflow-hidden relative z-10 transition-colors duration-500">
      
      <div className="absolute inset-0 z-[-1] overflow-hidden opacity-50">
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        
        {currentUser ? (
        
          <div>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 uppercase tracking-widest">
                ✨ Tailored For You
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4 leading-[1.2]">
                Recommended <span className="text-primary relative">
                  For You
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-orange-400" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                </span>
              </h2>
              <p className="text-body-color dark:text-gray-400 text-base max-w-[600px] mx-auto leading-relaxed">
                Based on your browsing habits and previous academic interests, we have selected these courses and intensive reviews to accelerate your success and excellence.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-bold">
                Loading recommendations...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1140px] mx-auto">
                {recommendedCourses.map((course) => {
                  const isWishlisted = isInWishlist(course.id);
                  const isEnrolled = checkEnrollment(course.id);

                  return (
                    <div key={course.id} className="bg-white dark:bg-[#0c111d] shadow-lg rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.02] group flex flex-col h-full">
                      
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        {!isEnrolled && (
                          <button
                            onClick={(e) => handleToggle(e, course)}
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

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <h3 className="font-bold text-base text-black dark:text-white leading-tight line-clamp-2 flex-1 text-left">
                            {course.title}
                          </h3>

                          <div className="flex flex-col items-end shrink-0 group/price">
                            <div className="flex items-baseline gap-0.5 text-primary">
                              <span className="text-sm font-bold">$</span>
                              <span className="text-2xl font-black tracking-tighter">
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

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-[1.2rem] mb-6 border border-gray-100 dark:border-gray-800/50 mt-auto text-left">
                          <p className="text-[9px] text-gray-400 uppercase font-black mb-1 tracking-widest">Next Lesson</p>
                          <p className="text-sm font-bold text-black dark:text-white truncate">
                            {course.nextLesson}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Link 
                            to={`/course/${course.id}`}
                            className="flex-1 py-3 px-2 border-2 border-primary/10 text-primary rounded-xl font-bold text-xs text-center transition-all hover:bg-primary/5 hover:border-primary"
                          >
                            Details
                          </Link>

                          {isEnrolled ? (
                            <Link
                              to="/my-courses"
                              className="flex-[1.5] py-3 px-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xs text-center transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-1"
                            >
                              <span>✓ Enrolled</span>
                            </Link>
                          ) : !isLoggedIn ? (
                            <button 
                              onClick={(e) => handleEnrollClick(e, course.id)}
                              className="flex-[1.5] py-3 px-2 bg-red-500 text-white rounded-xl font-bold text-xs text-center transition-all hover:bg-red-600 shadow-lg shadow-red-500/20"
                            >
                              Login to Buy
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => handleEnrollClick(e, course.id)}
                              className="flex-[1.5] py-3 px-2 bg-primary text-white rounded-xl font-bold text-xs transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/40"
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          
          <div className="flex flex-wrap items-center justify-center -mx-4 relative z-10">
            <div className="w-full lg:w-5/12 px-4 mb-12 lg:mb-0">
              <div className="relative max-w-[480px] mx-auto lg:mr-0 group">
                <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-primary/30 rounded-[2rem] transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80" 
                    alt="About Lurnix" 
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -right-8 top-10 bg-white dark:bg-[#121723] p-4 rounded-2xl shadow-xl z-20 animate-bounce-slow hidden md:block border border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-500">Top Rated</p>
                      <p className="text-sm font-black dark:text-white">Education Platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-6/12 px-4 lg:pl-16">
              <div className="max-w-[540px] mx-auto lg:ml-0 text-center lg:text-left">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 uppercase tracking-widest">
                  Our Story
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 leading-[1.2]">
                  More Than Just a Platform, <span className="text-primary relative">
                    A Learning Revolution.
                    <svg className="absolute -bottom-2 left-0 w-full h-2 text-orange-400" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                  </span>
                </h2>
                <p className="text-body-color dark:text-gray-400 text-lg mb-8 leading-relaxed opacity-90">
                  LURNIX was founded with a single mission: to make high-quality education accessible to everyone, everywhere. We combine technology with expert pedagogy.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {['Premium Course Content', 'Expert Certified Instructors', 'Lifetime Access', 'Real-time Progress'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-primary/5 hover:border-primary/20 transition-all">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <svg width="12" height="12" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="text-sm font-bold text-dark dark:text-gray-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AboutSection;