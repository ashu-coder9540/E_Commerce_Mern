import React, { useState } from "react";
import Logo from "../assets/Quickzy.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegUserCircle,
  FaShoppingCart,
  FaTimes,
  FaHome,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import SearchData from "./SearchData";
import toast from "react-hot-toast";
import { IoMdLogOut } from "react-icons/io";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  let token = localStorage.getItem("token");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  }
  return (
    <nav className="bg-gradient-to-r from-green-100  to-white shadow-md ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={"/"}>
            <div>
              <img src={Logo} alt="" className="h-24 w-auto" />
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                type="search"
                className="w-full bg-gray-200 rounded-full ps-4 pe-10 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-none border-2 border-gray-500"
                placeholder="Search Products name here"
                onFocus={() => setShowSearch(true)}
                readOnly
              />
              <FaSearch className="absolute right-3 top-3 text-sm text-gray-500" />
            </div>
          </div>
          {/* Menu Items  */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to={"/"} className="text-gray-700 hover:text-green-600 ">
              <FaHome className="text-xl" />
            </Link>
            <Link to={"/cart"} className="text-gray-700 hover:text-green-600 ">
              <FaShoppingCart className="text-xl" />
            </Link>
            <Link
              to={"/contact"}
              className="flex items-center gap-1 text-gray-700 hover:text-green-600"
            >
              <MdContactSupport className="text-xl" />
            </Link>
            {!token ? (
                <Link
              to={"/login"}
              className="flex items-center gap-1 text-gray-700 hover:text-green-600 hover:cursor-pointer"
            >
              <FaRegUserCircle className="text-xl" />
            </Link>) : (
              <IoMdLogOut onClick={handleLogOut} className="text-2xl font-extrabold text-red-500 hover:text-red-700"/>
            )}
            
          </div>
          {/* mobile toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-2xl text-green-600">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Items */}

      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-md">
          <Link to={"/"} className="block text-gray-700 hover:text-green-600">
            Home
          </Link>
          <Link
            to={"/cart"}
            className="block text-gray-700 hover:text-green-600"
          >
            Cart
          </Link>
          {
            !token ?  <Link
            to={"/login"}
            className="block text-gray-700 hover:text-green-600"
          >
            User
          </Link> : <button onClick={handleLogOut} className="block text-red-500 font-semibold hover:text-red-800">
            Logout
          </button>
          }
         
        </div>
      )}

      {showSearch && <SearchData onClose={setShowSearch}/>}

    </nav>
  );
};
 
export default Navbar;
