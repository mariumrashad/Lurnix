import React, { useState, useEffect } from "react";
import CourseCard from "../CourseCard";

const Courses = ({ onWishlistUpdate }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Design", "Development", "Marketing"];

  useEffect(() => {
    fetch("https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter((course) => {
    return activeTab === "All" || course.category === activeTab;
  });

  return (
    <section id="courses" className="bg-[#F8F9FF] dark:bg-[#060912] py-16 md:py-20 lg:py-28 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-dark dark:text-white mb-4 text-3xl font-bold sm:text-4xl md:text-[45px]">Explore Courses</h2>
          <div className="flex justify-center items-center mt-4">
            <div className="w-16 h-1.5 bg-primary rounded-full"></div>
            <div className="w-3 h-1.5 bg-primary rounded-full ml-1 opacity-50"></div>
          </div>
        </div>
        
        <div className="flex flex-col items-center mb-12 space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeTab === cat 
                    ? "bg-primary text-white shadow-lg scale-105" 
                    : "bg-white text-dark border border-gray-200 hover:border-primary/50 hover:bg-gray-50 dark:bg-dark dark:text-white dark:border-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap -mx-4">
          {loading ? (
            <div className="w-full text-center py-10">
              <p className="text-dark dark:text-white font-medium">Loading courses...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                <CourseCard course={course} onWishlistUpdate={onWishlistUpdate} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-20">
              <h3 className="text-xl font-semibold text-dark dark:text-white">No courses available in this category.</h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Courses;