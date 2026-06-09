import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import Header from "./components/Header/index"; 
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import AboutSection from "./components/AboutUs/AboutSection";
import Login from "./components/Login";
import SignUp from "./components/signup";
import CourseDetails from "./components/Courses/CourseDetails"; 
import WishlistPage from "./components/WishlistPage";
import CheckoutPage from "./components/CheckoutPage"; 
import MyCoursesPage from "./components/Courses/MyCoursesPage"; 
import CourseWatchPage from "./components/CourseWatch/CourseWatchPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const userWishlistKey = `wishlist_courses_${currentUser.uid}`;
      const saved = localStorage.getItem(userWishlistKey);
      setWishlist(saved ? JSON.parse(saved) : []);
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userWishlistKey = `wishlist_courses_${currentUser.uid}`;
      localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  const toggleWishlist = (course) => {
    if (!currentUser) return;
    setWishlist((prev) => {
      const isExist = prev.find((item) => item.id === course.id);
      if (isExist) return prev.filter((item) => item.id !== course.id);
      return [...prev, course];
    });
  };

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

const PageWrapper = ({ children, courses }) => {
  const location = useLocation();
  const { wishlist } = useWishlist(); 
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  return (
    <>
      {!isAuthPage && <Header wishlistCount={wishlist.length} courses={courses} />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-[#121723] flex items-center justify-center text-white">Loading...</div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

const AppContent = ({ allCourses }) => {
  const { currentUser } = useAuth();
  const { toggleWishlist, wishlist } = useWishlist();

  useEffect(() => {
    if (currentUser) {
      const pendingCourse = localStorage.getItem("pending_wishlist_course");
      if (pendingCourse) {
        const course = JSON.parse(pendingCourse);
        const isExist = wishlist.some((item) => item.id === course.id);
        if (!isExist) toggleWishlist(course);
        localStorage.removeItem("pending_wishlist_course");
      }
    }
  }, [currentUser, wishlist, toggleWishlist]);

  return (
    <PageWrapper courses={allCourses}>
      <Routes>
        <Route path="/" element={
          <main>
            <section id="home"><Hero /></section>
            <section id="about"><AboutSection /></section>
            <section id="courses"><Courses /></section>
          </main>
        } />
        
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/checkout/:courseId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/course/:id/watch" element={<CourseWatchPage />} />
        <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
      </Routes>
    </PageWrapper>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    fetch("https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/courses")
      .then((res) => res.json())
      .then((data) => setAllCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AuthProvider>
      <WishlistProvider> 
        <Router>
          <div className="min-h-screen bg-white dark:bg-[#121723]">
            <AppContent allCourses={allCourses} />
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;