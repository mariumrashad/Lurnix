import React from "react";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-[#EEF2FF] dark:bg-[#04070D] pt-16 pb-6 border-t border-primary/10 dark:border-white/[0.05] overflow-hidden transition-colors duration-500">
      
      <div className="absolute inset-0 z-[-1] overflow-hidden opacity-60">
        <div className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-orange-400/10 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-purple-500/5 blur-[120px]"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[1px]"></div>

      <div className="absolute right-0 top-10 -z-10 opacity-20">
        <svg width="200" height="200" viewBox="0 0 250 250" fill="none">
          <circle cx="220" cy="30" r="110" stroke="#4A6CF7" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4 justify-between">
          
          <div className="w-full px-4 sm:w-1/2 lg:w-4/12">
            <div className="mb-10">
              <a href="/" className="inline-block mb-6"> 
                <img src="/images/logo/logo.svg" alt="logo" className="h-10 w-auto" />
              </a>
              <p className="text-body-color dark:text-gray-400 text-sm leading-relaxed mb-7 max-w-[300px]">
                The all-in-one educational platform for accessing premium courses and study summaries. Empowering your learning journey with Lurnix.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.facebook.com/share/1bXJSbHnnL/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-white/50 dark:bg-white/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                >
                  <svg className="fill-current w-5 h-5" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" /></svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/marium-rashad-6a53582a4?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-white/50 dark:bg-white/5 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <svg className="fill-current w-5 h-5" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full px-4 sm:w-1/2 lg:w-2/12">
            <div className="mb-10">
              <h3 className="text-black dark:text-white mb-8 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#home" className="text-body-color dark:text-gray-400 hover:text-primary transition-colors text-sm">Home</a></li>
                <li><a href="#courses" className="text-body-color dark:text-gray-400 hover:text-primary transition-colors text-sm">Courses</a></li>
                <li><a href="#about" className="text-body-color dark:text-gray-400 hover:text-primary transition-colors text-sm">About Us</a></li>
              </ul>
            </div>
          </div>

          <div className="w-full px-4 lg:w-3/12">
            <div className="mb-10">
              <h3 className="text-black dark:text-white mb-8 text-lg font-bold">Newsletter</h3>
              <form className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-primary/10 bg-white/50 dark:bg-white/5 px-5 py-4 text-sm text-body-color outline-none focus:border-primary transition dark:text-white backdrop-blur-md"
                />
                <button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white px-5 py-4 rounded-2xl text-sm font-bold transition shadow-lg shadow-primary/20 active:scale-95">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>

          <div className="w-full px-4 lg:w-3/12">
            <div className="mb-10">
              <h3 className="text-black dark:text-white mb-8 text-lg font-bold">Contact Us</h3>
              <div className="space-y-4">
                <p className="text-body-color dark:text-gray-400 text-sm">Egypt, Cairo - Digital Learning Hub</p>
                <p className="text-body-color dark:text-gray-400 text-sm font-medium">info@lurnix-platform.com</p>
                <div className="pt-2">
                  <span className="inline-block bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/20">
                    +20 115 703 0598
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-primary/10 dark:border-white/[0.05] pt-8 text-center">
          <p className="text-body-color dark:text-gray-500 text-xs font-medium tracking-wide">
            &copy; {new Date().getFullYear()} <span className="text-primary font-bold">LURNIX</span> PLATFORM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;