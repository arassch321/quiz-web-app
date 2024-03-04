import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const isAuth = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full px-[15%] bg-white bg-opacity-50 p-5 flex justify-between items-center">
      <Link to="/dashboard-admin" className="text-2xl font-bold">
        Quiz Admin
      </Link>
      <div>
        {isAuth ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
