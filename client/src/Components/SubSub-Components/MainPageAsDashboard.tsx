import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plane,
  Shield,
  TrendingUp,
  Clock,
  Globe,
  Users,
  CheckCircle,
  ArrowRight,
  Award,
  Zap,
  Cloud,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainWel: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    { icon: Shield, text: "Secure & Encrypted", color: "text-blue-500" },
    { icon: Clock, text: "Real-time Updates", color: "text-emerald-500" },
    { icon: Globe, text: "Global Coverage", color: "text-cyan-500" },
    { icon: Users, text: "24/7 Support", color: "text-amber-500" },
  ];

  const stats = [
    { value: "10K+", label: "Flights Daily", icon: Plane },
    { value: "50+", label: "Countries", icon: Globe },
    { value: "98%", label: "On-time Rate", icon: CheckCircle },
    { value: "1M+", label: "Happy Travelers", icon: Users },
  ];

  const haldleExploreFlights = () => {
    navigate("/flights");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Clouds */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-24 bg-white/20 rounded-full blur-xl"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-60 h-32 bg-blue-100/30 rounded-full blur-xl"
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated Dots */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-2xl shadow-2xl">
                <Plane className="text-white w-12 h-12" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Welcome to SkyLine
            </span>
            <Sparkles
              className="inline-block ml-4 text-amber-400 animate-pulse"
              size={48}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            Your gateway to seamless flight management and booking experiences
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-100"
          >
            <Zap className="text-amber-500" size={20} />
            <span className="text-gray-700 font-semibold">
              Live System Status: All Systems Operational
            </span>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon
                  className={`w-10 h-10 ${
                    index === 0
                      ? "text-blue-500"
                      : index === 1
                      ? "text-cyan-500"
                      : index === 2
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }`}
                />
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose SkyLine Airlines?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white p-6 rounded-2xl border border-blue-100">
                  <div
                    className={`w-14 h-14 ${feature.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={feature.color} size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.text}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Experience the best in air travel with our premium services
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-10 text-white">
              <Award className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready for Your Next Adventure?
              </h3>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Join millions of satisfied travelers who trust SkyLine Airlines
                for their journeys
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={haldleExploreFlights}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                >
                  <span>Explore Flights</span>
                  <ArrowRight className="ml-2" size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <Navigation className="text-blue-500" size={20} />
            <span className="text-sm">
              SkyLine Airlines Management System v2.0
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm">All Systems Operational</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Airplane */}
      <motion.div
        className="absolute top-20 right-20 hidden lg:block"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <Cloud className="absolute -left-6 -top-6 text-blue-200/50 w-24 h-24" />
          <Plane className="text-blue-500 w-16 h-16 filter drop-shadow-lg" />
        </div>
      </motion.div>

      {/* Bottom Sparkles */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex justify-center"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles className="w-full max-w-4xl opacity-10 text-blue-400" />
      </motion.div>
    </div>
  );
};

export default MainWel;
