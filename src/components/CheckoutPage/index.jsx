import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 

  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showError, setShowError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    fetch(`https://6a27405ba84f9d39e9085cc7.mockapi.io/api/v1/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course details not found");
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        loadingCourse && setLoadingCourse(false);
      })
      .catch((err) => {
        console.error("Error fetching course for checkout:", err);
        setLoadingCourse(false);
      });
  }, [courseId]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setCardNumber(parts.join(" ").trim());
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setCardExpiry(value);
  };

  const validateForm = () => {
    if (cardName.trim().length < 3) {
      setShowError("Please enter a valid cardholder name");
      return false;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setShowError("Card number must be at least 16 digits");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setShowError("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (cardCvv.length !== 3) {
      setShowError("CVV must be 3 digits");
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setShowError("");

    if (!validateForm()) return;
    if (!currentUser) {
      setShowError("User session not found. Please log in again.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const userEnrolledKey = `enrolled_courses_${currentUser.uid}`;
      const enrolledCourses = JSON.parse(localStorage.getItem(userEnrolledKey)) || [];
      
      const formattedId = courseId.toString().trim();

      if (!enrolledCourses.includes(formattedId)) {
        enrolledCourses.push(formattedId);
        localStorage.setItem(userEnrolledKey, JSON.stringify(enrolledCourses));
      }

      window.dispatchEvent(new Event("coursesUpdated"));

      const wishlistKey = "wishlist";
      const currentWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      
      const updatedWishlist = currentWishlist.filter(
        (item) => item && item.id.toString().trim() !== formattedId
      );
      
      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));

      setShowSuccessAlert(true);
    }, 1800);
  };

  if (loadingCourse) {
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
            Checkout <span className="text-primary italic">.</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-lg">Complete your purchase securely</p>
        </div>

        <div className="bg-white dark:bg-[#0c111d] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-primary/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 bg-[#F8F9FF] dark:bg-[#060912] rounded-3xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">L</div>
              <div>
                <span className="text-xl font-black tracking-tight text-dark dark:text-white">LURNIX</span>
                <span className="block text-[10px] uppercase tracking-[2px] text-primary font-bold -mt-1">PREMIUM</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-dark dark:text-white leading-tight">
                {course?.title || "Premium Revision Package"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-3 text-[15px] line-clamp-4">
                {course?.description || "Unlock comprehensive materials, private dashboard, continuous quizzes, and instant evaluation reports."}
              </p>
            </div>

            <div className="mt-auto pt-10 border-t border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{course?.level || "Standard Tier"}</span>
                  <span className="font-semibold text-dark dark:text-white">
                    ${course?.price ? course.price.toString().replace('$', '') : '120.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Service Fee</span>
                  <span className="font-semibold text-dark dark:text-white">$0.00</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-dashed border-gray-300 dark:border-gray-700 flex justify-between items-baseline">
                <span className="text-lg font-bold text-dark dark:text-white">Total</span>
                <span className="text-4xl font-black text-primary tracking-tighter">
                  ${course?.price ? course.price.toString().replace('$', '') : '120.00'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">Payment Details</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Your transaction is secured with end-to-end encryption</p>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Marium Rashad"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-5 py-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary outline-none text-dark dark:text-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Card Number</label>
                <input
                  type="text"
                  maxLength="19"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-5 py-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary outline-none font-mono text-dark dark:text-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    maxLength="5"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full px-5 py-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary outline-none text-center text-dark dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">CVV</label>
                  <input
                    type="password"
                    maxLength="3"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full px-5 py-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary outline-none text-center text-dark dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              {showError && (
                <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-3 rounded-2xl">
                  {showError}
                </p>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Pay Securely • $${course?.price ? course.price.toString().replace('$', '') : '120.00'}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[1000] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#0c111d] rounded-[2.5rem] max-w-md w-full p-10 text-center border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center text-5xl mb-8">
              ✓
            </div>

            <h3 className="text-3xl font-black text-dark dark:text-white mb-3">Payment Successful</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10">
              Your premium access has been activated. Welcome to Lurnix!
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/my-courses")}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] transition-all"
              >
                Go to My Courses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;