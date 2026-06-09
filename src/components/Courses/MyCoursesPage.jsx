import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrolledIds = JSON.parse(localStorage.getItem("enrolled_courses")) || [];

    if (enrolledIds.length === 0) {
      setMyCourses([]);
      setLoading(false);
      return;
    }

    fetch("https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch database data");
        return res.json();
      })
      .then((allCourses) => {
        const filtered = allCourses.filter((course) =>
          enrolledIds.map(String).includes(course.id.toString())
        );
        setMyCourses(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading MockAPI courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#060912]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#F8F9FF] dark:bg-[#060912] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        <div className="mb-12">
          <h1 className="text-5xl font-black text-dark dark:text-white tracking-tight">
            My Courses <span className="text-primary italic">.</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-lg">Continue your learning journey</p>
        </div>

        {myCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800/60 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Enrolled Courses</p>
              <h3 className="text-3xl font-black text-dark dark:text-white">
                {myCourses.length} <span className="text-xs text-gray-400 font-normal">Active</span>
              </h3>
            </div>
            
            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800/60 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Lesson Progress</p>
              <h3 className="text-3xl font-black text-primary">
                0 <span className="text-sm text-gray-400 font-bold">watched</span> <span className="text-2xl font-black text-dark dark:text-white">/ 5</span>
              </h3>
            </div>

            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800/60 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Overall Completion</p>
              <h3 className="text-3xl font-black text-green-500">
                0% <span className="text-xs text-gray-400 font-normal">Finished</span>
              </h3>
            </div>
          </div>
        )}

        {myCourses.length === 0 ? (
          <div className="relative py-28 flex items-center justify-center">
            <div className="absolute -inset-10 z-0">
              <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply blur-[60px] animate-blob"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/30 dark:bg-primary/20 rounded-full mix-blend-multiply blur-[60px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 text-center py-20 px-10 max-w-xl bg-white/60 dark:bg-[#0c111d]/70 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800/50">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-blue-500 rounded-3xl flex items-center justify-center">
                <span className="text-5xl">📚</span>
              </div>
              
              <h2 className="text-3xl font-black text-dark dark:text-white mb-4">No Courses Yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm">
                You haven't purchased any courses yet. Explore our catalog and start learning today!
              </p>
              
              <Link 
  to="/#courses" 
  smooth 
  className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all inline-block"
>
  Browse Courses
</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myCourses.map((course) => (
              <div 
                key={course.id} 
                className="group bg-white dark:bg-[#0c111d] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-md text-primary text-xs font-black px-4 py-1.5 rounded-2xl">
                    {course.level || "Premium"}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-2xl font-mono">
                    0%
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-dark dark:text-white leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-6">
                    <span>⭐ {course.rating || "5.0"}</span>
                    <span>⏱️ {course.duration || "Continuous Access"}</span>
                    <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-lg">Premium Package</span>
                  </div>

                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: `0%` }}
                    ></div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/course/${course.id}/watch`)}
                      className="flex-1 py-4 bg-primary text-white text-center font-bold text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
                    >
                      Continue Learning
                    </button>
                    
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="flex-1 py-4 border border-gray-300 dark:border-gray-700 text-dark dark:text-white text-center font-bold text-xs rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      View Details
                    </button>
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

export default MyCoursesPage;