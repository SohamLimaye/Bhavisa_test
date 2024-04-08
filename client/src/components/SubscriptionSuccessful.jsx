// SubscriptionSuccessful.jsx
import React, { useEffect } from 'react';
import { createSubscription, getAllUsers } from '../api'; // Import your API functions
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccessful = () => {
    const [{ user }, dispatch] = useStateValue();
    const navigate = useNavigate();

    useEffect(() => {
        const createAndActivateSubscription = async (userId, planId) => {
            try {
                const subscriptionId = await createSubscription(userId, planId); // Create subscription in your backend
                // Update user's subscription status in your application
                dispatch({
                    type: actionType.SET_USER_SUBSCRIPTION,
                    subscriptionId: subscriptionId,
                });
                navigate("/");
            } catch (error) {
                console.error("Failed to create subscription:", error);
            }
        };

        if (user?.user?._id) {
            // Assuming you have a selectedPlan state that holds the selected subscription plan ID
            createAndActivateSubscription(user?.user._id, selectedPlan);
        }
    }, [dispatch, navigate, user, selectedPlan]);

    return (
        <div>
            <h1>Subscription Successful</h1>
            <p>Your subscription has been activated.</p>
        </div>
    );
};

export default SubscriptionSuccessful;
