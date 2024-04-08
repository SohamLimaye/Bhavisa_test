import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CompleteLogo } from '../assets/img/index';
import { FaCrown } from "react-icons/fa";
import { useStateValue } from "../Context/StateProvider";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { motion } from "framer-motion";
import { checkoutPayment } from '../api';

const Header = () => {
    const [{ user }, dispatch] = useStateValue();
    const [isMenu, setIsMenu] = useState(false);
    const [showSubscriptionOptions, setShowSubscriptionOptions] = useState(false);
    const navigate = useNavigate();

    const checkoutHandler = async (amount) => {
        checkoutPayment(amount).then((data) => {
            const options = {
                key: process.env.REACT_APP_RAZORPAY_API_KEY,
                key_secret: process.env.REACT_APP_RAZORPAY_API_SECRET,
                amount: data.order.amount,
                currency: "INR",
                name: "Bookify",
                description: "Buy Bookify Premium",
                order_id: data.order.id,
                callback_url: "http://localhost:4000/api/payment/paymentVerification",
                prefill: {
                    name: "Shreyash",
                    email: "shreyash.kadam10@gmail.com",
                    contact: "7208673440"
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
            };
            const razor = new window.Razorpay(options);
            razor.open();
        });
    };

    const logout = () => {
        const firebaseAuth = getAuth(app);
        firebaseAuth
            .signOut()
            .then(() => {
                window.localStorage.setItem("auth", "false");
            })
            .catch((e) => console.log(e));
        navigate("/login", { replace: true });
    };

    return (
        <header className='flex justify-between w-full p-4 md:py-1 md:px-6 mt-4'>
            <div className="flex justify-center items-center">
                <NavLink to="/home">
                    <img src={CompleteLogo} alt="Logo" className='h-12' />
                </NavLink>
            </div>

            {!user?.user.isPremium && (
                <div className="relative">
                    <button onClick={() => setShowSubscriptionOptions(!showSubscriptionOptions)} className="text-yellow-800 text-2xl hover:text-yellow-500 font-semibold">
                        Buy Premium
                    </button>
                    {showSubscriptionOptions && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-lg font-semibold">Select Subscription Duration</p>
                                    <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowSubscriptionOptions(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <ul className="space-y-4">
                                    <li>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg" onClick={() => checkoutHandler(200)}>1 Month - ₹200</button>
                                    </li>
                                    <li>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg" onClick={() => checkoutHandler(600)}>3 Months - ₹600</button>
                                    </li>
                                    <li>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg" onClick={() => checkoutHandler(1200)}>6 Months - ₹1200</button>
                                    </li>
                                    <li>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg" onClick={() => checkoutHandler(2400)}>12 Months - ₹2400</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center cursor-pointer gap-2 relative"
                onMouseEnter={() => setIsMenu(true)}
                onMouseLeave={() => setIsMenu(false)}
            >
                <img
                    className="w-12 min-w-[44px] object-cover rounded-full shadow-lg"
                    src={user?.user?.imageURL}
                    alt=""
                    referrerPolicy="no-referrer"
                />
                <div className='flex flex-col'>
                    <p className="text-textColor text-lg hover:text-headingColor font-semibold">
                        {user?.user.name}
                    </p>
                    {user?.user.isPremium && (
                        <p className="flex items-center gap-2 text-xs text-gray-500 font-normal">
                            Premium Member <FaCrown className="text-xm -ml-1 text-yellow-500" />
                        </p>
                    )}
                    {!user?.user.isPremium && (
                        <p className="flex items-center gap-2 text-xs text-gray-500 font-normal">
                            Free Member
                        </p>
                    )}
                </div>
                {isMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute z-10 top-12 right-0 w-275 p-4 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
                    >
                        <NavLink to={"/userProfile"}>
                            <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                                Profile
                            </p>
                        </NavLink>
                        <hr />
                        {user?.user.role === "admin" && (
                            <>
                                <NavLink to={"/dashboard/home"}>
                                    <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                                        Dashboard
                                    </p>
                                </NavLink>
                                <hr />
                            </>
                        )}
                        <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out"
                            onClick={logout}>
                            Sign out
                        </p>
                    </motion.div>
                )}

            </div>

        </header>
    );
};

export default Header;
