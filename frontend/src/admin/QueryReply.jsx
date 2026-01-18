import { useNavigate, useParams } from "react-router-dom";
import Slidebar from "./Slidebar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const QueryReply = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState({
    to: "",
    userQuery: "",
    sub: "",
    body: "",
  })
  const {id} = useParams();
  async function queryData() {
    try {
      const response = await fetch(`/api/querysingledata/${id}`);
      const record = await response.json();
      if(response.ok){
        setQuery({to:record.data.Email, userQuery:record.data.Query});
      }else{
        console.log(record.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
   function handleChange(e){
    setQuery({...query, [e.target.name]: e.target.value});   
    }
    async function handleForm(e){
        e.preventDefault();
      try {
        const response = await fetch(`/api/mailreply/${id}`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(query),
      })
      const record = await response.json();
      if(response.ok){
        toast.success(record.message)
        navigate("/admin/query")
      }else{
        toast.error(record.message)
      }
      } catch (error) {
        toast.error(error)
      }  
    }
  useEffect(()=>{
    queryData()
  },[id])
  return (
    <div className="flex">
      <Slidebar />
      <div className="flex-1 p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Reply Query🚀</h1>
        <form
          action=""
          onSubmit={handleForm}
          className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto space-y-6"
        >
          <label htmlFor="" className="block text-gray-700 font-medium mb-1">
            To
          </label>
          <input
            type="text"
            name="to"
            id=""
            value={query.to}
            placeholder="Mail-to"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <label htmlFor="" className="block text-gray-700 font-medium mb-1">
            From
          </label>
          <input
            type="text"
            name=""
            id=""
            value={"ashu954008@gmail.com"}
            placeholder="Mail-From"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <label htmlFor="" className="block text-gray-700 font-medium mb-1">
            Sub
          </label>
          <input
            type="text"
            name="sub"
            id=""
            onChange={handleChange}
            value={query.sub}
            placeholder="Sub.."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
           <label htmlFor="" className="block text-gray-700 font-medium mb-1">
            User Query
          </label>
          <textarea
            name="userQuery"
            id=""
            value={query.userQuery}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <label htmlFor="" className="block text-gray-700 font-medium mb-1">
            Body
          </label>
          <textarea
            name="body"
            id=""
            value={query.body}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>

          <div className="text-right">
            <button className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
              Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueryReply;