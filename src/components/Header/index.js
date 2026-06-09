import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useAuth } from "../../context/AuthContext";

const Header = ({ wishlist = [], courses = [] }) => {
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const usePathName = location.pathname;

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) setSticky(true);
    else setSticky(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setFilteredResults([]);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmenu = (index) => setOpenIndex(openIndex === index ? -1 : index);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilteredResults(value.trim() === "" ? [] : courses.filter((c) => c.title.toLowerCase().includes(value.toLowerCase())));
  };

  const executeSearch = (courseId) => {
    if (courseId) navigate(`/course/${courseId}`);
    else if (filteredResults.length > 0) navigate(`/course/${filteredResults[0].id}`);
    setFilteredResults([]); setSearchValue(""); setIsSearchVisible(false);
  };

  const handleLogout = async () => {
    try { setProfileDropdownOpen(false); await logout(); navigate("/"); } catch (err) { console.error(err); }
  };

  const userInitial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "U";
  const userName = currentUser?.email ? currentUser.email.split("@")[0] : "Student";

  return (
    <header className={`header top-0 left-0 z-40 flex w-full items-center ${sticky ? "dark:bg-gray-dark dark:shadow-sticky-dark shadow-sticky fixed z-[9999] bg-white/80 backdrop-blur-md transition" : "absolute bg-transparent"}`}>
      <div className="container mx-auto px-4">
        <div className="relative flex w-full items-center justify-between">
          <div className="w-[120px] md:w-60 max-w-full flex-shrink-0">
            <Link smooth to="/#home" className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"}`}>
              <img src="/images/logo/logo.svg" alt="logo" className="dark:hidden block w-[180px] h-[50px] object-contain" />
              <img src="/images/logo/logo.svg" alt="logo" className="hidden dark:block w-[180px] h-[50px] object-contain" />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-4">
            <nav id="navbarCollapse" className="navbar hidden lg:block">
              <ul className="lg:flex lg:space-x-12">
                {menuData.map((menuItem, index) => {
                  const displayTitle = (menuItem.title.toLowerCase() === "about us" && currentUser) ? "Your Guide" : menuItem.title;
                  return (
                    <li key={index} className="group relative">
                      {menuItem.path ? (
                        <Link smooth to={menuItem.path} className={`flex py-2 text-base font-medium lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${usePathName === menuItem.path ? "text-primary dark:text-white" : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"}`}>
                          {displayTitle}
                        </Link>
                      ) : (
                        <p onClick={() => handleSubmenu(index)} className="text-dark group-hover:text-primary flex cursor-pointer items-center justify-between py-2 text-base font-medium lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 dark:text-white/70 dark:group-hover:text-white">
                          {displayTitle}
                          <span className="pl-2"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg></span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className={`flex items-center justify-end flex-shrink-0 space-x-1 md:space-x-3 transition-all duration-300 ${isSearchVisible ? "gap-2" : ""}`}>
            <div className={`flex items-center transition-all duration-300 ${isSearchVisible ? "flex-1" : ""}`} ref={searchRef}>
              <div className="relative flex items-center justify-end w-full">
                <div className={`flex items-center transition-all duration-300 overflow-visible ${isSearchVisible ? "w-full md:w-[220px] opacity-100 visible" : "w-0 opacity-0 invisible"}`}>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                    className="w-full border border-primary/50 bg-white px-4 py-1.5 text-xs text-dark outline-none shadow-sm dark:bg-dark dark:text-white rounded-full"
                  />
                  {filteredResults.length > 0 && (
                    <div className="absolute top-[120%] left-0 w-full max-h-[300px] overflow-y-auto bg-white dark:bg-dark rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/10 z-[100]">
                      {filteredResults.map((course) => (
                        <div key={course.id} onClick={() => executeSearch(course.id)} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-0">
                          <p className="text-sm font-medium text-dark dark:text-white truncate">{course.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setIsSearchVisible(!isSearchVisible)} className={`relative z-[60] flex h-9 w-9 items-center justify-center rounded-full text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 transition-all ${isSearchVisible ? "ml-2" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </div>
            </div>

            <Link smooth to="/wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              {wishlist.length > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white animate-bounce">{wishlist.length}</span>}
            </Link>

            {!currentUser ? (
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark dark:text-white">Log In</Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-2 pr-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                  <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">{userInitial}</div>
                  <div className="hidden md:flex flex-col items-start pr-2">
                    <span className="text-sm font-bold text-dark dark:text-white">{userName}</span>
                    <span className="text-[10px] text-gray-400">Student</span>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-[120%] mt-2 w-56 bg-white dark:bg-[#121723] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/[0.06] py-2 z-[99999]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]"><p className="text-xs font-bold text-dark dark:text-white truncate">{currentUser.email}</p></div>
                    <div className="p-1 space-y-0.5">
                      <Link to="/my-courses" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-dark dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">📚 My Courses</Link>
                      <Link to="/wishlist" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-dark dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">❤️ My Wishlist</Link>
                    </div>
                    <div className="border-t border-gray-100 dark:border-white/[0.05] p-1"><button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">🚪 Sign Out</button></div>
                  </div>
                )}
              </div>
            )}
            <div className="pl-1"><ThemeToggler /></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;