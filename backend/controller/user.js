const userCollection = require("../models/user");
const productCollection = require("../models/Product");
const queryCollection = require("../models/Query");
const cartCollection = require("../models/cart");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const regDataController = async (req, res) => {
  try {
    const { fname, email, pass } = req.body;

    if (!fname || !email || !pass) {
      res.status(400).json({ message: "All fields are required🥲" });
    }

    const emailExist = await userCollection.findOne({ userEmail: email });

    console.log(emailExist);

    if (emailExist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(pass, 10);

    const record = new userCollection({
      userName: fname,
      userEmail: email,
      userPass: hashPassword,
    });

    await record.save();
    res.status(200).json({ message: "Successfully registered" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginDataController = async (req, res) => {
  try {
    const { loginEmail, loginPass } = req.body;

    const userCheck = await userCollection.findOne({ userEmail: loginEmail });

    if (!userCheck) {
      return res.status(400).json({ message: "User not found..!" });
    }

    const matchPass = await bcrypt.compare(loginPass, userCheck.userPass);

    if (!matchPass) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const token = jwt.sign(
    {
      id: userCheck._id,
    },
    process.env.JWT_SECRET, 
    { expiresIn: "1h"}
  )
    res.status(200).json({
      message: "Successfully Login...😍",
      data: userCheck,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userProductsDataController = async (req, res) => {
  
  try {
    const category = req.query.category;
    
    //Doubt
    let filter = { productStatus: "In-Stock" };

    if( category && category.toLowerCase() !== "all"){
      filter.productCategory = category.toLowerCase();
    }

    const record = await productCollection.find(filter);
    res.status(200).json({
      data: record,
      message: "Successfully added to cart"
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userQueryController = async (req, res) => {
  try {
    const { userName, userEmail, userQuery } = req.body;
    const record = new queryCollection({
      Name: userName,
      Email: userEmail,
      Query: userQuery,
    });
    await record.save();
    res.status(200).json({
      message: "Your Query Submitted Successfully...😍",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error...😥" });
  }
};

const saveCartController = async (req, res) => {
  try {
    const {userId, cartItems, totalPrice, totalQuantity} = req.body;

    let cart = await cartCollection.findOne({ userId })

    if (cart){
      cart.cartItems = cartItems;
      cart.totalPrice = totalPrice;
      cart.totalQuantity = totalQuantity;
      await cart.save();
    }else{
    cart = new cartCollection({
      userId,
      cartItems,
      totalPrice,
      totalQuantity,
      });
      await cart.save();
    }
    
    res.status(200).json({ message: "Cart Save Successfully...✅"})
    } catch (error) {
    res.status(500).json({message: "Internal server error...🥲"})
  }
}

const fetchCartController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    //doubt
    const cart = await cartCollection.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchController = async (req, res) => {
  try {
      const keyword = req.query.q;
      const result = await productCollection.find({
      productName: { $regex: keyword, $options: "i" },
      productStatus: "In-Stock",
    });
    res.status(200).json({data: result})
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  regDataController,
  loginDataController,
  userProductsDataController,
  userQueryController,
  saveCartController,
  fetchCartController,
  searchController,
};
