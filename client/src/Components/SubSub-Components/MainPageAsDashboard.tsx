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
    { icon: Shield, text: "Secure & Encrypted", color: "text-[#F09848]" },
    { icon: Clock, text: "Real-time Updates", color: "text-green-400" },
    { icon: Globe, text: "Global Coverage", color: "text-cyan-400" },
    { icon: Users, text: "24/7 Support", color: "text-[#ffb366]" },
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
    <div className="min-h-screen bg-gradient-to-br from-[#182850] via-[#1e3058] to-[#0f1c42] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Clouds */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-24 bg-[#F09848]/10 rounded-full blur-xl"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-60 h-32 bg-[#F09848]/5 rounded-full blur-xl"
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated Dots */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#F09848]/20 rounded-full"
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
              <div className="absolute -inset-4 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-[#F09848] to-[#ffb366] p-4 rounded-2xl shadow-2xl border border-[#F09848]/30">
                <Plane className="text-[#182850] w-12 h-12" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-[#F09848] via-[#ffb366] to-[#F09848] bg-clip-text text-transparent">
              Welcome to SkyLine
            </span>
            <Sparkles
              className="inline-block ml-4 text-[#F09848] animate-pulse"
              size={48}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-[#b0c4c4] max-w-3xl mx-auto mb-10"
          >
            Your gateway to seamless flight management and booking experiences
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="inline-flex items-center space-x-2 bg-[#1e3058]/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-[#2a3a6a]"
          >
            <Zap className="text-[#F09848]" size={20} />
            <span className="text-[#E8F0F0] font-semibold">
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
              className="bg-[#1e3058] rounded-2xl p-6 shadow-lg border border-[#2a3a6a]"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon
                  className={`w-10 h-10 ${
                    index === 0
                      ? "text-[#F09848]"
                      : index === 1
                      ? "text-cyan-400"
                      : index === 2
                      ? "text-green-400"
                      : "text-[#ffb366]"
                  }`}
                />
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-[#E8F0F0] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#b0c4c4]">{stat.label}</div>
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
          <h2 className="text-3xl font-bold text-center text-[#E8F0F0] mb-10">
            Why Choose SkyLine Airlines?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-[#1e3058] p-6 rounded-2xl border border-[#2a3a6a]">
                  <div
                    className={`w-14 h-14 ${feature.color.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center mb-4 border ${
                      feature.color === 'text-[#F09848]' 
                        ? 'border-[#F09848]/30' 
                        : feature.color === 'text-green-400'
                        ? 'border-green-400/30'
                        : feature.color === 'text-cyan-400'
                        ? 'border-cyan-400/30'
                        : 'border-[#ffb366]/30'
                    }`}
                  >
                    <feature.icon className={feature.color} size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#E8F0F0] mb-2">
                    {feature.text}
                  </h3>
                  <p className="text-[#b0c4c4] text-sm">
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
            <div className="absolute -inset-4 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-2xl p-8 md:p-10 text-[#182850] border border-[#F09848]/30">
              <Award className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready for Your Next Adventure?
              </h3>
              <p className="text-[#182850]/80 mb-8 max-w-xl mx-auto">
                Join millions of satisfied travelers who trust SkyLine Airlines
                for their journeys
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={haldleExploreFlights}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#182850] text-[#F09848] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center border border-[#F09848]/30 hover:border-[#F09848]/50"
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
          <div className="flex items-center justify-center space-x-4 text-[#b0c4c4]">
            <Navigation className="text-[#F09848]" size={20} />
            <span className="text-sm">
              SkyLine Airlines Management System v2.0
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
          <Cloud className="absolute -left-6 -top-6 text-[#F09848]/20 w-24 h-24" />
          <Plane className="text-[#F09848] w-16 h-16 filter drop-shadow-lg" />
        </div>
      </motion.div>

      {/* Bottom Sparkles */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex justify-center"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles className="w-full max-w-4xl opacity-10 text-[#F09848]" />
      </motion.div>
    </div>
  );
};

export default MainWel;