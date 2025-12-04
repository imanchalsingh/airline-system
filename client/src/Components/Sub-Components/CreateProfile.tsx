import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormField =
  | "name"
  | "email"
  | "country"
  | "state"
  | "district"
  | "city"
  | "districtCode";

const inputForms: { type: string; name: FormField; placeholder: string }[] = [
  { type: "text", name: "name", placeholder: "Full Name" },
  { type: "email", name: "email", placeholder: "Email Address" },
  { type: "text", name: "country", placeholder: "Country" },
  { type: "text", name: "state", placeholder: "State/Province" },
  { type: "text", name: "district", placeholder: "District" },
  { type: "text", name: "city", placeholder: "City" },
  { type: "number", name: "districtCode", placeholder: "District Code" },
];

const CreateProfile: React.FC = () => {
  const [passwordDialog, setPasswordDialog] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Record<FormField, string>>({
    name: "",
    email: "",
    country: "",
    state: "",
    district: "",
    city: "",
    districtCode: "",
  });

  const [role, setRole] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeStep] = useState(1);

  const ADMIN_DEFAULT_PASSWORD = "admin123";

  const handlePasswordDialog = () => {
    setPasswordDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setRole(selectedValue);
    if (selectedValue === "Admin") {
      handlePasswordDialog();
    }
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_DEFAULT_PASSWORD) {
      setIsAdmin(true);
      setPasswordDialog(false);
    } else {
      setIsAdmin(false);
      setAdminPassword("");
      alert("Incorrect Admin Password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create profile");

      await res.json();
      navigate("/route-card", { state: { isAdmin } });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4 md:p-6">
      {/* Header Section with Airline Theme */}
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">SkyLine Airlines</h1>
              <p className="text-xs text-gray-600">Profile Management System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Need Help?</p>
              <p className="text-xs text-blue-600">support@skylineair.com</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex flex-col items-center ${step <= activeStep ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200'} font-bold text-lg shadow-md transition-all duration-300`}>
                    {step}
                  </div>
                  <span className="mt-2 text-sm font-medium">
                    {step === 1 ? 'Details' : step === 2 ? 'Role' : 'Complete'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`w-16 md:w-24 h-1 mx-4 ${step < activeStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Create Airline Profile</h1>
                <p className="text-blue-100 mt-2">Complete the form below to register your airline profile</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white text-sm">Secure & Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side - Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inputForms.map(({ type, name, placeholder }) => (
                      <div key={name} className="space-y-2">
                        <label className="text-gray-700 font-medium text-sm uppercase tracking-wide">
                          {placeholder}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type={type}
                            name={name}
                            placeholder={`Enter ${placeholder.toLowerCase()}`}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full p-3.5 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium text-sm uppercase tracking-wide">
                        Account Role
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={role}
                          onChange={handleRoleChange}
                          className="w-full p-3.5 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white appearance-none shadow-sm"
                          required
                        >
                          <option disabled value="">Select your role</option>
                          <option value="User">Standard User</option>
                          <option value="Admin">Administrator</option>
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-medium">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                      <p>By submitting, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a></p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <div className="flex items-center space-x-2">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating Profile...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Profile</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side - Information Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-b from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 h-full">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Profile Creation Guide
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <p className="text-sm text-gray-700">Fill in accurate airline details for verification</p>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <p className="text-sm text-gray-700">Select appropriate role based on your responsibilities</p>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <p className="text-sm text-gray-700">Admin role requires password verification</p>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-blue-200 pt-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Role Information</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold">U</span>
                          </div>
                          <h5 className="font-semibold text-gray-800">Standard User</h5>
                        </div>
                        <p className="text-sm text-gray-600">Basic access to flight schedules and booking management</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-cyan-600 font-bold">A</span>
                          </div>
                          <h5 className="font-semibold text-gray-800">Administrator</h5>
                        </div>
                        <p className="text-sm text-gray-600">Full system access with management privileges</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-xl border border-blue-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Secure & Encrypted</p>
                        <p className="text-xs text-gray-600">All data is protected with 256-bit encryption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Cloud Sync</h4>
                <p className="text-sm text-gray-600">Auto-sync across all devices</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Verified Profiles</h4>
                <p className="text-sm text-gray-600">Industry-standard verification</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">24/7 Support</h4>
                <p className="text-sm text-gray-600">Always available to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Password Dialog */}
      {passwordDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Admin Verification</h3>
                    <p className="text-blue-100 text-sm">Enter admin password to continue</p>
                  </div>
                </div>
                <button
                  onClick={() => setPasswordDialog(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <form onSubmit={handleAdminPasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Admin Password
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter admin password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Default password: "admin123"</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setPasswordDialog(false)}
                    className="flex-1 py-3.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Verify & Continue
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Admin access provides full system control. Please ensure you have proper authorization before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateProfile;