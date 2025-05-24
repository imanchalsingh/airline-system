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
  { type: "text", name: "name", placeholder: "Name" },
  { type: "email", name: "email", placeholder: "Email" },
  { type: "text", name: "country", placeholder: "Country" },
  { type: "text", name: "state", placeholder: "State" },
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
      const res = await fetch("http://localhost:5000/api/users", {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c9dfff8c] px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1e941a] mb-2">
          Create Airline's Profile
        </h1>
        <p className="text-gray-600 mb-6">
          Fill in the details below to create your profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
      >
        {inputForms.map(({ type, name, placeholder }) => (
          <div className="relative w-full" key={name}>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="green-hover-input p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1e941a] transition-all duration-300 shadow-sm text-[#1e941a]"
              required
            />
          </div>
        ))}
        <select
          value={role}
          onChange={handleRoleChange}
          className="green-hover-input p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1e941a] transition-all duration-300 shadow-sm text-[#1e941a]"
          required
        >
          <option disabled value="">
            Select Role
          </option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        {errorMsg && (
          <p className="col-span-full text-red-600 text-center">{errorMsg}</p>
        )}

        <div className="col-span-full flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 bg-[#256b22] hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-all duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Profile"}
          </button>
        </div>
      </form>
      {/* ✅ Dialog Box */}
      {passwordDialog && (
        <div className="fixed inset-0 bg-[#75767579] bg-opacity-50 flex items-center justify-center z-50">
          <div className=" relative bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <button
              onClick={() => setPasswordDialog(false)}
              title="Remove booking"
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 cursor-pointer"
            >
              🗑
            </button>
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Enter Admin Password
            </h2>
            <form onSubmit={handleAdminPasswordSubmit}>
              <input
                type="password"
                placeholder="Admin Password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="green-hover-input p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1e941a] transition-all duration-300 shadow-sm text-[#1e941a]"
              />
              <button
                type="submit"
                className="bg-[#256b22] text-white px-6 py-1.5 rounded hover:bg-[#1e941a] transition cursor-pointer mt-4"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
