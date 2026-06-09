import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWishlist } from "../../App"; 
import { useAuth } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const checkEnrollment = () => {
    if (!currentUser) return false;
    const userEnrolledKey = `enrolled_courses_${currentUser.uid}`;
    const enrolledIds = JSON.parse(localStorage.getItem(userEnrolledKey)) || [];
    return enrolledIds.includes(Number(id)) || enrolledIds.includes(String(id));
  };

  const isEnrolled = checkEnrollment();
  const isFavorite = course && !isEnrolled ? isInWishlist(course.id) : false;

  useEffect(() => {
    const endpoint = id.startsWith("rec_") ? "recommended_courses" : "courses";

    fetch(`http://localhost:5000/${endpoint}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course not found");
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);

        if (isEnrolled && isInWishlist(data.id)) {
          toggleWishlist(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setCourse(null); 
        setLoading(false);
      });
  }, [id, currentUser, isEnrolled]);

  const handleWishlistClick = () => {
    if (!currentUser) {
      localStorage.setItem("pending_wishlist_course", JSON.stringify(course));
      navigate("/login", { state: { from: `/course/${id}` } });
      return;
    }
    toggleWishlist(course);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#060912]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#060912]">
        <h2 className="text-2xl font-black dark:text-white mb-4">Course not found</h2>
        <button 
          onClick={() => navigate("/")} 
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-[#060912] pb-20 pt-32">
      
      <div className="container mx-auto px-4 mb-12">
        <button 
          onClick={() => navigate("/")} 
          className="group mb-6 flex items-center gap-2 text-xs font-black text-primary tracking-widest transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO COURSES
        </button>
        
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-[2px] uppercase mb-6">
            {course.category} • {course.level}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark dark:text-white mb-6 leading-[1.1]">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-yellow-400/10 text-yellow-600 px-3 py-1 rounded-lg text-sm font-bold">
              ⭐ {course.rating} Rating
            </div>
            <div className="text-sm font-bold">
              👥 {course.students} Students enrolled
            </div>
            <div className="text-sm font-bold">
              ⏱️ {course.duration} Total Length
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          
          <div className="w-full lg:w-2/3 px-4">
            <div className="flex justify-start mb-12">
              <div className="relative w-full max-w-[650px] rounded-[32px] overflow-hidden shadow-2xl border-1 dark:border-gray-800 shadow-primary/5">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-[320px] object-cover transition-transform duration-700 hover:scale-105" 
                />
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-white text-[10px] font-black uppercase tracking-wider">
                  Course Preview
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0c1222] border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-bold dark:text-white mb-8">Course Curriculum</h3>
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center gap-6 p-5 rounded-2xl border border-transparent hover:border-primary/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center font-black shrink-0 transition-colors">
                      {step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm md:text-base dark:text-white">
                        {step === 1 ? "Introduction to " + course.category : "Advanced " + course.category + " Modules"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">12 Videos • 45 Minutes</p>
                    </div>
                    <div className="hidden md:block text-primary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 px-4 mt-12 lg:mt-0">
            <div className="sticky top-32 space-y-6">
              
              <div className="bg-white dark:bg-[#0c1222] border-2 border-primary/10 rounded-[32px] p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
                
                <div className="mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">One-time payment</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black dark:text-white">{course.price}</span>                    
                    <span className="text-gray-400 line-through text-lg font-bold">$149.00</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {isEnrolled ? (
                    <button 
                      onClick={() => navigate(`/course/${course.id}/watch`)}
                      className="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-500/25 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>▶ Start Watching Now</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => navigate(`/checkout/${course.id}`)}
                        className="w-full py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary/25 active:scale-95"
                      >
                        Start Learning Now
                      </button>
                      
                      <button 
                        onClick={handleWishlistClick}
                        className={`w-full py-4 border-2 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                          isFavorite 
                            ? "border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10" 
                            : "border-gray-100 dark:border-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black text-dark dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">Course Features</p>
                  {[
                    { icon: "⚡", text: "Instant Lifetime Access" },
                    { icon: "📁", text: "24 Downloadable Resources" },
                    { icon: "🏆", text: "Verifiable Certificate" },
                    { icon: "📱", text: "Access on Mobile & TV" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <span className="text-primary w-5">{item.icon}</span> {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark dark:bg-primary/10 rounded-[32px] p-6 text-white dark:text-primary flex items-center gap-4 border border-transparent dark:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-primary text-white flex items-center justify-center font-black">
                  MM
                </div>
                <div>
                  <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">Instructor</p>
                  <p className="font-bold">Marium Rashad</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;