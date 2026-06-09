import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useAuth } from "../../context/AuthContext";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userEnrolledKey = `enrolled_courses_${currentUser.uid}`;
    const enrolledIds = JSON.parse(localStorage.getItem(userEnrolledKey)) || [];

    if (enrolledIds.length === 0) {
      setMyCourses([]);
      setLoading(false);
      return;
    }

    fetch("https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/courses")
      .then((res) => res.json())
      .then((allCourses) => {
        const filtered = allCourses.filter((course) =>
          enrolledIds.map(String).includes(course.id.toString())
        );
        setMyCourses(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        setLoading(false);
      });
  }, [currentUser]);

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
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-dark dark:text-white tracking-tight">
            My Courses <span className="text-primary italic">.</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-lg">Continue your learning journey</p>
        </div>

        {myCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800/60 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Enrolled</p>
              <h3 className="text-3xl font-black text-dark dark:text-white">{myCourses.length}</h3>
            </div>
            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800/60 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Progress</p>
              <h3 className="text-3xl font-black text-primary">0%</h3>
            </div>
            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800/60 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Completed</p>
              <h3 className="text-3xl font-black text-green-500">0</h3>
            </div>
          </div>
        )}

        {myCourses.length === 0 ? (
          <div className="relative py-28 flex items-center justify-center">
            <div className="absolute -inset-10 z-0">
              <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-[60px] animate-blob"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/30 dark:bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-[60px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 text-center py-20 px-10 max-w-xl bg-white/60 dark:bg-[#0c111d]/70 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800/50 flex flex-col items-center">
              <div className="relative mb-10">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-80"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-3xl flex items-center justify-center shadow-lg relative z-10 text-5xl">
                  📚
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-dark dark:text-white mb-4 tracking-tight">
                No Courses Yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm font-medium">
                You haven't enrolled in any courses yet. Explore our catalog and start your learning journey today!
              </p>
              
              <Link 
                to="/#courses" 
                smooth 
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest border border-primary"
              >
                Explore The Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {myCourses.map((course) => (
              <div key={course.id} className="group bg-white dark:bg-[#0c111d] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl transition-all">
                <div className="relative h-56 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-2xl text-primary text-xs font-black">{course.level}</div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">{course.title}</h3>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => navigate(`/course/${course.id}/watch`)} className="flex-1 py-4 bg-primary text-white font-bold text-xs rounded-2xl">Continue Learning</button>
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