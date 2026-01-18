import React, { useEffect, useState } from "react";
import Slidebar from "./Slidebar";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditProducts = () => {
    const navigate = useNavigate();
    const [edit, setEdit] = useState({})
    const {id} = useParams();
    
    async function editedValueData(){
        try {
          const response = await fetch(`/api/editvaluedata/${id}`)
          const record = await response.json()
          setEdit(record.data)
        } catch (error) {
          console.log(error)
        }
    }
    useEffect(()=>{
      editedValueData()
},[])
  function handleChange(e){
    setEdit({...edit, [e.target.name]: e.target.value});   
    }
    async function handleForm(e){
      try {
         e.preventDefault()
      const formData = {Pname: edit.productName, Pprice: edit.productPrice, Cat: edit.productCategory, Pstatus: edit.productStatus};
      const response = await fetch(`/api/updateProduct/${id}`,{
        method: "PUT",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(formData),
      })
      const record = await response.json();
      
      if(response.ok){
        toast.success(record.message)
        navigate("/admin/products")
      }else{
        toast.error(record.message)
      }
      } catch (error) {
        toast.error(record.message)
      }
    }

  return (
    <div className="flex">
      <Slidebar />
      <div className="flex-1 p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Edit Products 🚀
        </h1>
        <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-400" onClick={()=>{navigate("/admin/products")}}>
            Back
        </button>
        <form onSubmit={handleForm} className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto space-y-6">
        {/* Product Name */}
        <label className="block text-gray-700 font-medium mb-1">Product Name</label>
        <input required type="text" name="productName" value={edit.
productName
} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100" placeholder="eg: Fresh Fruits"/>

          {/* Price in rupees*/}
        <label className="block text-gray-700 font-medium mb-1">Price ₹</label>
        <input required type="number" name="productPrice" value={edit.productPrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100" placeholder="eg: 999"/>
        
        {/* Categories */}
         <label className="block text-gray-700 font-medium mb-1">Categories</label>
         <select required name="productCategory" value={edit.productCategory
} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-100 focus:ouline-none focus:ring-2 border border-gray-300 focus:ring-purple-500">
            <option value="">---Select---</option>
            <option value="cafe">Cafe</option>
            <option value="home">Home</option>
            <option value="toys">Toys</option>
            <option value="fresh">Fresh</option>
            <option value="electronics">Electronics</option>
            <option value="mobile">Mobile</option>
            <option value="beauty">Beauty</option>
         </select>

         {/* In Stock/ Out stock */}
        <label className="block text-gray-700 font-medium mb-1">Action</label>

         <select required name="productStatus" value={edit.productStatus} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-100 focus:ouline-none focus:ring-2 border border-gray-300 focus:ring-purple-500">
            <option value="">---Select---</option>
            <option value="In-Stock">In-Stock</option>
            <option value="Out-Of-Stock">Out-Of-Stock</option>
         </select>

         {/* Product Image */}
          <label className="block text-gray-700 font-medium mb-1">Product Image</label>
           <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 bg-gray-100" placeholder="eg: 999"/>

        {/* Add Product */}
        <div className="text-right">
            <button className="bg-purple-500 text-white px-6 py-2 hover:bg-purple-700 rounded-lg transition">
               Save Changes
            </button>
        </div>
        </form>

      </div>
    </div>
  );
};

export default EditProducts;