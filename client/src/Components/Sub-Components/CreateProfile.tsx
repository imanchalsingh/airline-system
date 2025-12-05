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
    <div className="min-h-screen bg-gradient-to-br from-[#182850] to-[#0f1c42] p-4 md:p-6">
      {/* Header Section with Airline Theme */}
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F09848] to-[#ffb366] rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#E8F0F0]">SkyLine Airlines</h1>
              <p className="text-xs text-[#b0c4c4]">Profile Management System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-[#E8F0F0]">Need Help?</p>
              <p className="text-xs text-[#F09848]">support@skylineair.com</p>
            </div>
            <div className="w-10 h-10 bg-[#2a3a6a] rounded-full flex items-center justify-center">
              <span className="text-[#F09848] font-bold">?</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex flex-col items-center ${step <= activeStep ? 'text-[#F09848]' : 'text-[#4a5a8a]'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step <= activeStep ? 'bg-[#F09848] text-white' : 'bg-[#2a3a6a]'} font-bold text-lg shadow-md transition-all duration-300`}>
                    {step}
                  </div>
                  <span className="mt-2 text-sm font-medium text-[#E8F0F0]">
                    {step === 1 ? 'Details' : step === 2 ? 'Role' : 'Complete'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`w-16 md:w-24 h-1 mx-4 ${step < activeStep ? 'bg-[#F09848]' : 'bg-[#2a3a6a]'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1e3058] rounded-2xl shadow-xl overflow-hidden mb-8 border border-[#2a3a6a]">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#182850] to-[#2a3a6a] p-6 md:p-8 border-b border-[#2a3a6a]">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#E8F0F0]">Create Airline Profile</h1>
                <p className="text-[#b0c4c4] mt-2">Complete the form below to register your airline profile</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center px-4 py-2 bg-[#F09848]/20 backdrop-blur-sm rounded-lg border border-[#F09848]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F09848] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#F09848] text-sm">Secure & Encrypted</span>
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
                        <label className="text-[#E8F0F0] font-medium text-sm uppercase tracking-wide">
                          {placeholder}
                          <span className="text-[#F09848] ml-1">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type={type}
                            name={name}
                            placeholder={`Enter ${placeholder.toLowerCase()}`}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full p-3.5 pl-12 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all duration-300 bg-[#1e3058] hover:bg-[#25386a] text-[#E8F0F0] placeholder-[#7a8ab8] shadow-sm"
                            required
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F09848]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="text-[#E8F0F0] font-medium text-sm uppercase tracking-wide">
                        Account Role
                        <span className="text-[#F09848] ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={role}
                          onChange={handleRoleChange}
                          className="w-full p-3.5 pl-12 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] transition-all duration-300 bg-[#1e3058] hover:bg-[#25386a] text-[#E8F0F0] appearance-none shadow-sm"
                          required
                        >
                          <option disabled value="" className="bg-[#1e3058]">Select your role</option>
                          <option value="User" className="bg-[#1e3058]">Standard User</option>
                          <option value="Admin" className="bg-[#1e3058]">Administrator</option>
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F09848]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7a8ab8] pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="mt-6 p-4 bg-[#F09848]/10 border border-[#F09848]/30 rounded-xl">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F09848] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-[#F09848] font-medium">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#2a3a6a]">
                    <div className="text-sm text-[#b0c4c4] mb-4 sm:mb-0">
                      <p>By submitting, you agree to our <a href="#" className="text-[#F09848] hover:underline">Terms of Service</a></p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative px-8 py-3.5 bg-gradient-to-r from-[#F09848] to-[#ffb366] hover:from-[#e8893a] hover:to-[#ffa754] text-[#182850] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <div className="flex items-center space-x-2">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-[#182850]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <div className="bg-gradient-to-b from-[#1e3058] to-[#25386a] border border-[#2a3a6a] rounded-2xl p-6 h-full">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#E8F0F0] mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F09848] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Profile Creation Guide
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-[#F09848]/20 text-[#F09848] rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <p className="text-sm text-[#E8F0F0]">Fill in accurate airline details for verification</p>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-[#F09848]/20 text-[#F09848] rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <p className="text-sm text-[#E8F0F0]">Select appropriate role based on your responsibilities</p>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-[#F09848]/20 text-[#F09848] rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <p className="text-sm text-[#E8F0F0]">Admin role requires password verification</p>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-[#2a3a6a] pt-6">
                    <h4 className="font-semibold text-[#E8F0F0] mb-3">Role Information</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#1e3058] rounded-xl border border-[#2a3a6a] shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-[#F09848]/20 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-[#F09848] font-bold">U</span>
                          </div>
                          <h5 className="font-semibold text-[#E8F0F0]">Standard User</h5>
                        </div>
                        <p className="text-sm text-[#b0c4c4]">Basic access to flight schedules and booking management</p>
                      </div>
                      <div className="p-4 bg-[#1e3058] rounded-xl border border-[#2a3a6a] shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-[#F09848]/30 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-[#F09848] font-bold">A</span>
                          </div>
                          <h5 className="font-semibold text-[#E8F0F0]">Administrator</h5>
                        </div>
                        <p className="text-sm text-[#b0c4c4]">Full system access with management privileges</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[#1e3058] rounded-xl border border-[#2a3a6a]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#F09848]/20 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F09848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#E8F0F0]">Secure & Encrypted</p>
                        <p className="text-xs text-[#b0c4c4]">All data is protected with 256-bit encryption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="bg-[#1e3058] rounded-2xl shadow-sm p-6 border border-[#2a3a6a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F09848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-[#E8F0F0]">Cloud Sync</h4>
                <p className="text-sm text-[#b0c4c4]">Auto-sync across all devices</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F09848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-[#E8F0F0]">Verified Profiles</h4>
                <p className="text-sm text-[#b0c4c4]">Industry-standard verification</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F09848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-[#E8F0F0]">24/7 Support</h4>
                <p className="text-sm text-[#b0c4c4]">Always available to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Password Dialog */}
      {passwordDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e3058] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn border border-[#2a3a6a]">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-[#182850] to-[#2a3a6a] p-6 border-b border-[#2a3a6a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#F09848]/20 rounded-xl flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F09848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#E8F0F0]">Admin Verification</h3>
                    <p className="text-[#b0c4c4] text-sm">Enter admin password to continue</p>
                  </div>
                </div>
                <button
                  onClick={() => setPasswordDialog(false)}
                  className="text-[#b0c4c4] hover:text-[#E8F0F0] transition-colors"
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
                  <label className="block text-[#E8F0F0] text-sm font-medium mb-2">
                    Admin Password
                    <span className="text-[#F09848] ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter admin password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full p-4 pl-12 border border-[#2a3a6a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F09848] focus:border-[#F09848] bg-[#1e3058] text-[#E8F0F0] placeholder-[#7a8ab8]"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F09848]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-[#b0c4c4] mt-2">Default password: "admin123"</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setPasswordDialog(false)}
                    className="flex-1 py-3.5 px-4 border border-[#2a3a6a] text-[#E8F0F0] font-medium rounded-xl hover:bg-[#25386a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#F09848] to-[#ffb366] hover:from-[#e8893a] hover:to-[#ffa754] text-[#182850] font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Verify & Continue
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-[#2a3a6a]">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#F09848]/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F09848]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#b0c4c4]">
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