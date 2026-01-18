const productCollection = require("../models/Product");
const queryCollection = require("../models/Query");
const nodemailer = require("nodemailer");
const addadminproductController = async (req, res) => {
  try {
    const Pimage = req.file.filename;
    const { Pname, Price, Cat } = req.body;
    if (!Pname || !Price || !Cat) {
      return res.status(400).json({ message: "All fields are required..😥" });
    }

    const record = new productCollection({
      productName: Pname,
      productPrice: Price,
      productCategory: Cat,
      productImage: Pimage,
    });
    await record.save();
    res.status(200).json({ message: "Successfully Insert Product..😍" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error...🥲" });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const record = await productCollection.find();
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: "Internal server error..🥲" });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    await productCollection.findByIdAndDelete(id);
    res.status(200).json({ message: "Successfully Deleted🚀" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error..🥲" });
  }
};

const editValueDataController = async (req, res) => {
  try {
    const id = req.params.abc;
    const record = await productCollection.findById(id);
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: "Internal server error..🥲" });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { Pname, Pprice, Cat, Pstatus } = req.body;
    const id = req.params.id;

    await productCollection.findByIdAndUpdate(id, {
      productName: Pname,
      productPrice: Pprice,
      productCategory: Cat,
      productStatus: Pstatus,
    });
    res.status(200).json({ message: "Successfully Updated..😍" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error..🥲" });
  }
};

const userAllQueryController = async (req, res) => {
  try {
    const record = await queryCollection.find();
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error...🥲" });
  }
};

const deleteQueryController = async (req, res) => {
  try {
    const id = req.params.abc;
    await queryCollection.findByIdAndDelete(id);
    res.status(200).json({ message: "Successfully deleted...👍" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...🥲" });
  }
};

const queryDataController = async (req, res) => {
  try {
    const id = req.params.abc;
    const record = await queryCollection.findById(id);
    res.status(200).json({ data: record });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...🥲" });
  }
};

const mailReplyController = async (req, res) => {
  try {
    const { to, sub, userQuery, body } = req.body;
    const id = req.params.abc;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ashu954008@gmail.com",
        pass: "tiebeecdcazgmwne",
      },
    });

      const info = transporter.sendMail({
        from: '"QUICKZY" <ashu954008@gmail.com>',
        to: to,
        subject: sub,
        text: body, // plain‑text body
        html: body, // HTML body
      });
    await queryCollection.findByIdAndUpdate(id,{
      QueryStatus: "Read",
    })  
    res.status(200).json({ message: "Successfully Replied...👍" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...🥲" });
  }
};
module.exports = {
  addadminproductController,
  getAllProductsController,
  deleteProductController,
  editValueDataController,
  updateProductController,
  userAllQueryController,
  deleteQueryController,
  queryDataController,
  mailReplyController,
};
