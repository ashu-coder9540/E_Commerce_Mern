import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice/cartSlice.js";
import Category from "./Category.jsx";
import toast from "react-hot-toast";

const Products = () => {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState("All");


  // Using Redux dispatch to manage cart state
  // This allows us to add products to the cart
   const dispatch = useDispatch();
  // Fetching products from the API
  // This function retrieves product data from the server
  async function ProductData(selectCategory = "All") {
    try {
      const response = await fetch(`/api/userProducts?category=${selectCategory}`);
      const record = await response.json();
      
      if(response.ok){
        setProduct(record.data)
      }
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }
  useEffect(()=>{
    ProductData(category);
  },[category])
  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      <Category onSelectCategory={setCategory}/>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        Trending Products 🔥
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7">
        {product.map((item) => (
          <div key={item._id} className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
            <img
              src={`/uploads/${item.productImage}`}
              alt="ProductImage"
              className="rounded-lg w-full h-32 object-contain border"
            />
            <h3 className="mt-2 font-medium text-gray-700">
              {item.productName}
            </h3>
            <p className="text-gray-600 text-sm font-medium">{item.productCategory}</p>
            <p className="text-green-600 text-lg font-bold">₹{item.productPrice}</p>
            <p className="text-blue-500 font-semibold">{item.productStatus}</p>
            <button className="mt-2 w-full bg-green-500 text-white py-1 rounded-md hover:bg-green-700"
            onClick={()=>{
              dispatch(addToCart(item));
              }}>
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;