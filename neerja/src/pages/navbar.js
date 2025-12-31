import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", path: "/" },





     { name: "About", path: "/about" },
     { name: "Research", path: "/research" },
    { name: "Analysis ", path: "/analysis" },
    {name:"Biodiversity", path:"/biodiversity"},
   { name: "Contact", path: "/contact" },
   //{ name: "NeerBot", path: "/NeerBot" },


   



  ];

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
        <nav className="bg-[#0D1117] text-white flex items-center justify-between px-6 py-3 shadow">
      {/* Left Logo + Hamburger */}
      <div className="flex items-center space-x-4">
        <span className="font-montserrat text-3xl font-bold">Neerja</span>
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4 relative">
        <input
          type="text"
          placeholder="Search for data, location..."
          className="hidden md:block px-3 py-1 rounded-md text-black"
        />

        {user ? (
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{user.name}</span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-36 bg-[#161B22] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <NavLink
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold"
          >
            Login
          </NavLink>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0D1117] flex flex-col items-start px-6 py-4 space-y-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {!user && (
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold w-full text-center"
            >
              Login
            </NavLink>
          )}

          {user && (
            <div className="border-t border-gray-600 pt-2 w-full flex flex-col space-y-1">
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700 w-full"
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
