import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const { currentUser } = useAuth();

  const formatStudentName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }

    if (currentUser?.email) {
      let emailFront = currentUser.email.split("@")[0].toLowerCase();

      emailFront = emailFront.replace(/[0-9]/g, "");

      const knownNames = [
        "marium", "rashad", "fatma", "abdullah", "mariem",
        "hossam", "roumaysaa", "nour", "ahmed", "mohamed",
        "saga", "rewan", "yasmeen", "lubna", "salwa", "marwa"
      ];

      let foundFirst = "";
      let foundLast = "";

      for (const name of knownNames) {
        if (emailFront.startsWith(name)) {
          foundFirst = name;
          const remainder = emailFront.substring(name.length);

          const matchedLast = knownNames.find(ln => remainder.startsWith(ln) || remainder.includes(ln));
          foundLast = matchedLast || remainder;
          break;
        }
      }

      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

      if (foundFirst && foundLast && foundLast !== foundFirst) {
        return `${capitalize(foundFirst)} ${capitalize(foundLast)}`;
      }

      const cleanName = emailFront
        .replace(/[._-]/g, " ")
        .trim();

      if (cleanName.includes(" ")) {
        return cleanName
          .split(" ")
          .filter(word => word.length > 0)
          .map(word => capitalize(word))
          .join(" ");
      }

      if (cleanName.length > 8) {
        const half = Math.ceil(cleanName.length / 2);
        return `${capitalize(cleanName.substring(0, half))} ${capitalize(cleanName.substring(half))}`;
      }

      return capitalize(cleanName);
    }

    return "Marium Rashad";
  };

  const studentName = formatStudentName();

  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[100px] md:pt-[150px] xl:pb-[140px] xl:pt-[180px] 2xl:pb-[180px] 2xl:pt-[210px] 
        bg-[#EEF2FF] dark:bg-[#04070D] transition-colors duration-500 min-h-[75vh] flex items-center"
      >
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div className="absolute -top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-primary/25 blur-[130px] dark:bg-primary/20 animate-pulse"></div>
          <div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-[120px] dark:bg-orange-600/10"></div>
        </div>

        <div className="container mx-auto px-4 w-full">

          {currentUser ? (
            <div className="max-w-3xl mx-auto text-center animate-fade-in py-12 relative">

              <div className="hidden lg:block absolute -left-12 top-0 px-4 py-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-primary/10 shadow-2xl animate-[bounce_4s_infinite_1s] text-xs font-black text-primary backdrop-blur-sm">
                ✨ Frontend Track active
              </div>
              <div className="hidden lg:block absolute -right-12 bottom-4 px-4 py-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-primary/10 shadow-2xl animate-[bounce_5s_infinite_2s] text-xs font-black text-purple-500 backdrop-blur-sm">
                🚀 UI/UX Sync Complete
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                Welcome Back
              </div>

              <h1 className="mb-6 text-5xl font-black leading-tight text-black dark:text-white sm:text-7xl tracking-tight transition-all">
                Hello, <br className="sm:hidden" />
                <span className="relative inline-block text-primary bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(74,108,247,0.25)] dark:drop-shadow-[0_2px_20px_rgba(74,108,247,0.4)] pb-1">
                  {studentName}
                </span> 👋
              </h1>

              <p className="mb-10 text-base font-medium leading-relaxed text-gray-500 dark:text-gray-400 max-w-xl mx-auto sm:text-lg opacity-90">
                Ready to continue your learning journey? Access your private dashboard to track progress, download summaries, and jump straight into your active courses.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/my-courses"
                  className="w-full sm:w-auto group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_-10px_rgba(74,108,247,0.5)] active:scale-95 shadow-md shadow-primary/20"
                >
                  <span className="relative z-10">Go To My Dashboard</span>
                  <svg className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.025 4.94165L17.0833 9.99998L12.025 15.0583" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.91666 10H16.9417" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
                </Link>

                <Link
                smooth
                  to="#courses"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-10 py-4 text-base font-bold text-black dark:text-white transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 hover:border-primary/30 backdrop-blur-sm"
                >
                  <span>Browse Catalog</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4 lg:w-6/12 lg:pl-20 text-center lg:text-left">
                <div className="max-w-[800px] mb-12 lg:mb-0">
                  <h1 className="mb-6 text-4xl font-extrabold leading-tight text-black dark:text-white sm:text-5xl md:text-6xl tracking-tight">
                    Find Your <span className="text-orange-500 drop-shadow-sm">Ideal</span> Course, Build{" "}
                    <span className="relative inline-block px-1">
                      <span className="relative z-10 text-primary">Lurnix</span>
                    </span>{" "}
                    Skills
                  </h1>
                  <p className="mb-10 text-base font-medium leading-relaxed text-body-color dark:text-gray-300 sm:text-lg md:text-xl opacity-90">
                    Redefining education with Lurnix. Access premium resources and track your real-time progress with our advanced ecosystem.
                  </p>
                  <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
                    <Link to="/login" className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="relative z-10">Join Us Now</span>
                    </Link>
                    <a href="#courses" className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/10 bg-black/5 dark:bg-white/5 px-10 py-4 text-base font-bold text-black dark:text-white transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-sm">
                      <span>Explore Courses</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full px-4 lg:w-5/12">
                <div className="relative z-10 mx-auto max-w-[650px] lg:ml-auto lg:-mr-16">
                  <div className="relative overflow-hidden rounded-3xl z-10">
                    <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Student" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
  <svg 
    className="relative block w-[calc(100%+1.3px)] h-[80px]" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 1200 120" 
    preserveAspectRatio="none"
  >
    <path 
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
      className="fill-[#F8F9FF] dark:fill-[#04070D] !transition-none" 
    />
  </svg>
</div>

      </section>
    </>
  );
};

export default Hero;