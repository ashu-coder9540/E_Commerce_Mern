import React, { useState } from "react";
import Slidebar from "./Slidebar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const AddProducts = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({Pname:"", Price:"", Cat:""})
    const [pimage, setPimage] = useState("")

    async function handleForm(e){
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("Pname",product.Pname);
      formdata.append("Price",product.Price);
      formdata.append("Cat",product.Cat);
      formdata.append("image", pimage)

      try{
        const response = await fetch("/api/addadminproduct",{
          method: "POST",
          body: formdata,
        });
        const result = await response.json();
        if(response.ok){
          toast.success(result.message);
          navigate("/admin/products")
        }else{
          toast.error(result.message)
        }
      }
      catch(error){
        toast.error(error)
      }
    }
    function handleChange(e){
    setProduct({...product, [e.target.name]: e.target.value});   
    }
  return (
    <div className="flex">
      <Slidebar />
      <div className="flex-1 p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Add Products 🛒
        </h1>
        <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-400" onClick={()=>{navigate("/admin/products")}}>
            Back
        </button>
        <form encType="multipart/form-data" onSubmit={handleForm}
        className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto space-y-6">
        {/* Product Name */}
        <label className="block text-gray-700 font-medium mb-1">Product Name</label>
        <input type="text" name="Pname" required value={product.Pname} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100" placeholder="eg: Fresh Fruits"/>

          {/* Price in rupees*/}
        <label className="block text-gray-700 font-medium mb-1">Price ₹</label>
        <input type="number" name="Price"required value={product.Price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100" placeholder="eg: 999"/>
        
        {/* Categories */}
         <label className="block text-gray-700 font-medium mb-1">Categories</label>
         <select value={product.Cat} required name="Cat" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-100 focus:ouline-none focus:ring-2 border border-gray-300 focus:ring-purple-500">
            <option value="">---Select---</option>
            <option value="cafe">Cafe</option>
            <option value="Home">Home</option>
            <option value="toys">Toys</option>
            <option value="fresh">Fresh</option>
            <option value="electronics">Electronics</option>
            <option value="mobile">Mobile</option>
            <option value="beauty">Beauty</option>
         </select>

         {/* Product Image */}
          <label className="block text-gray-700 font-medium mb-1">Product Image</label>
           <input type="file" onChange={(e)=>{setPimage(e.target.files[0])}} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 bg-gray-100" placeholder="eg: 999"/>

        {/* Add Product */}
        <div className="text-right">
            <button type="submit" className="bg-purple-500 text-white px-6 py-2 hover:bg-purple-700 rounded-lg transition">
                Add Product
            </button>
        </div>
        </form>

      </div>
    </div>
  );
};

export default AddProducts;