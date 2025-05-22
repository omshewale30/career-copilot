import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { setUserTier, checkSubscription } from '../api/subscription';
import Spinner from '../components/Spinner';

export const plans = [
  {
    name: "Pro",
    link: "https://buy.stripe.com/test_eVq4gybaF4sv9qbcxl3gk02",
    priceId: "price_1ROrCRAoomA59kIN70kFdyV6"
  }
]

function PricingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        const { tier } = await checkSubscription();
        if (tier) {
          // If user has a subscription, redirect to home
          localStorage.setItem("tier", tier);
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSubscription();
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      console.log('Before unload event triggered');
      console.log('checkout_started:', sessionStorage.getItem('checkout_started'));
      
      if (sessionStorage.getItem('checkout_started') === 'true') {
        console.log('Redirecting to resume-upload');
        navigate('/resume-upload');
        sessionStorage.removeItem('checkout_started');
      }
    };

    window.addEventListener('popstate', handleBeforeUnload);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleBeforeUnload);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_intent') || urlParams.get('payment_intent_client_secret')) {
      sessionStorage.setItem('payment_completed', 'true');
    }
  }, []);

  useEffect(() => {
    const preCheckoutUrl = sessionStorage.getItem('pre_checkout_url');
    if (preCheckoutUrl && sessionStorage.getItem('checkout_started') === 'true') {
      console.log('Returning from checkout, redirecting to resume-upload');
      navigate('/resume-upload');
      sessionStorage.removeItem('checkout_started');
      sessionStorage.removeItem('pre_checkout_url');
    }
  }, [navigate]);

  const handleCheckoutStart = (planLink) => {
    console.log('Starting checkout process');
    sessionStorage.setItem('checkout_started', 'true');
    sessionStorage.setItem('pre_checkout_url', window.location.href);
    window.open(`${planLink}?prefilled_email=${localStorage.getItem("user_email")}`, '_blank');
  };

  const handleFreePlan = () => {
    localStorage.setItem("tier", "free");
    localStorage.setItem("hasAccess", false);
    /* Set user tier to free in the database */
    setUserTier("free");
    
    navigate('/resume-upload');
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e5e7eb]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#6366f1] opacity-10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-[#7c3aed] opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#2dd4bf] opacity-10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[#e5e7eb]/80 max-w-2xl mx-auto">
            Select the perfect plan to accelerate your career growth with AI-powered guidance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/10 backdrop-blur-lg rounded-2xl p-8 border border-[#e5e7eb]/10 hover:border-[#e5e7eb]/20 transition-all duration-300"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-[#e5e7eb]/60 ml-2">forever</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Basic resume optimization",
                "Limited AI chat support",
                "Basic career insights",
                "Community access"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center text-[#e5e7eb]/80"
                >
                  <Check className="w-5 h-5 text-[#2dd4bf] mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFreePlan}
              className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#6366f1] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#6366f1]/30 transition-all duration-300 flex items-center justify-center group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#2dd4bf]/20 to-[#2dd4bf]/10 backdrop-blur-lg rounded-2xl p-8 border border-[#e5e7eb]/10 hover:border-[#e5e7eb]/20 transition-all duration-300 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#2dd4bf] to-[#6366f1] text-white px-4 py-1 rounded-full text-sm font-medium">
              Best Value
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$7</span>
                <span className="text-[#e5e7eb]/60 ml-2">one-time payment</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Advanced resume optimization",
                "Unlimited AI chat support",
                "Detailed skill gap analysis",
                "Personalized career roadmap",
                "Priority support",
                "Lifetime access"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center text-[#e5e7eb]/80"
                >
                  <Check className="w-5 h-5 text-[#2dd4bf] mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCheckoutStart(plans[0].link)}
              className="w-full py-3 bg-gradient-to-r from-[#2dd4bf] to-[#6366f1] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#2dd4bf]/30 transition-all duration-300 flex items-center justify-center group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "What's included in the Pro plan?",
                answer: "The Pro plan includes unlimited AI chat support, advanced resume optimization, detailed skill gap analysis, personalized career roadmap, priority support, and lifetime access to all features."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards and PayPal. All payments are processed securely through Stripe."
              },
              {
                question: "Is the Pro plan really a one-time payment?",
                answer: "Yes! The Pro plan is a one-time payment of $7 that gives you lifetime access to all premium features."
              },
              {
                question: "Can I upgrade from Free to Pro later?",
                answer: "Yes, you can upgrade to the Pro plan at any time to get access to all premium features."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-[#161b22] rounded-xl p-6 border border-[#e5e7eb]/10"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-[#e5e7eb]/80">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PricingPage;


