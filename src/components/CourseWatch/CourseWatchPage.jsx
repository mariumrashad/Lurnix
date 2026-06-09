import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseWatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);

  const mockLessons = [
    { id: 1, title: "01. Introduction & Welcome to the Course", duration: "12:45", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 2, title: "02. Core Fundamentals & Basic Concepts", duration: "18:20", videoUrl: "https://media.w3org/2010/05/sintel/trailer_hd.mp4" },
    { id: 3, title: "03. Advanced Practical Techniques & Use Cases", duration: "25:10", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 4, title: "04. Real-world Projects & Final Assignment Summary", duration: "14:55", videoUrl: "https://media.w3org/2010/05/sintel/trailer_hd.mp4" },
  ];

  useEffect(() => {
fetch(`https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/courses/${id}`)      .then((res) => {
        if (!res.ok) throw new Error("Course not found");
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

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
        <h2 className="text-2xl font-black dark:text-white mb-4">Content Protected or Not Found</h2>
        <button onClick={() => navigate("/my-courses")} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold">
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-[#060912] pt-28 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button 
            onClick={() => navigate("/my-courses")}
            className="flex items-center gap-2 text-xs font-black text-primary tracking-widest uppercase hover:opacity-80 transition-all"
          >
            ← Back to Classroom
          </button>
          <div>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {course.category || "Study Module"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-3/4 px-4 mb-8 lg:mb-0">
            <div className="relative bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 aspect-video">
              <video
                key={activeLesson}
                controls
                autoPlay
                className="w-full h-full object-cover"
                src={mockLessons[activeLesson]?.videoUrl}
              />
            </div>

            <div className="mt-6 p-6 bg-white dark:bg-[#0c111d] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h1 className="text-xl md:text-3xl font-black text-dark dark:text-white leading-tight mb-2">
                {mockLessons[activeLesson]?.title}
              </h1>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Course Subject: <span className="text-primary font-bold">{course.title}</span>
              </p>
              
            </div>
          </div>

          <div className="w-full lg:w-1/4 px-4">
            <div className="bg-white dark:bg-[#0c111d] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 shadow-sm sticky top-28">
              <div className="mb-4">
                <h3 className="font-black text-lg text-dark dark:text-white">Course Syllabus</h3>
                <p className="text-xs text-gray-400 mt-0.5">{mockLessons.length} Comprehensive Lessons</p>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {mockLessons.map((lesson, index) => {
                  const isActive = index === activeLesson;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(index)}
                      className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.01]"
                          : "bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-dark dark:text-gray-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? "bg-white text-primary" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      }`}>
                        {isActive ? "▶" : index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold truncate leading-snug ${isActive ? "text-white" : "text-dark dark:text-white"}`}>
                          {lesson.title}
                        </h4>
                        <span className={`text-[10px] mt-1 block font-medium ${isActive ? "text-white/70" : "text-gray-400"}`}>
                          ⏱️ {lesson.duration} Mins
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseWatchPage;