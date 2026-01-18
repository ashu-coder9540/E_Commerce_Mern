import React, { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [query, setQuery] = useState({
    userName: "",
    userEmail: "",
    userQuery: "",
  });
  function handleChange(e) {
    setQuery({ ...query, [e.target.name]: e.target.value });
  }
  async function handleForm(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/userquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setQuery({
          userName: "",
          userEmail: "",
          userQuery: "",
        });
      } else{
        toast.error(result.message)
      }
    } catch (error) {
      toast.error(error)
    }
  }
  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded-xl shadow-xl border-2 border-green-300">
      <h2 className="text-2xl font-bold text-green-500 mb-4 text-center ">
        Query Form 🗒️
      </h2>
      <form action="" onSubmit={handleForm}>
        {/* Name */}
        <label className="block text-gray-700 font-medium mb-1">
          Your Name
        </label>
        <input
          type="text"
          name="userName"
          value={query.userName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
          placeholder="eg: John Anthony"
        />

        {/* E-mail */}
        <label className="block text-gray-700 font-medium mb-1">E-Mail</label>
        <input
          type="email"
          name="userEmail"
          value={query.userEmail}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
          placeholder="eg: abc@gmail.com"
        />

        {/* Query */}
        <label className="block text-gray-700 font-medium mb-1">
          Your Query
        </label>
        <textarea
          name="userQuery"
          value={query.userQuery}
          id=""
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 max-h-56"
          placeholder="Your Query..."
        ></textarea>
        <button className="w-full bg-green-500 py-4 rounded-lg hover:bg-green-700 transition text-white font-semibold text-lg mt-3">
          Submit Query
        </button>
      </form>
    </div>
  );
};

export default Contact;
