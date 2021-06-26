var express = require('express');
var router = express.Router();
var {Product,validate} = require("../models/product");
var checkSessionAuth = require("../middlewares/checkSessionAuth");
/* GET home page. */
router.get("/", async function (req, res, next) {
  let products = await Product.find();
  console.log(req.session.user);
  res.render("products/list", { title: "Products In DB", products });
});
router.get("/add",checkSessionAuth, async function (req, res, next) {
  res.render("products/add");
});
router.post("/add", async function (req, res, next) {
  const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
  let product = new Product(req.body);
  await product.save();
  res.redirect("/products");
});
router.get("/delete/:id", async function (req, res, next) {
  let product = await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});
router.get("/cart/:id", async function (req, res, next) {
  let product = await Product.findById(req.params.id);
  console.log("Add this Product in Cart");
  let cart =[];
  if(req.cookies.cart) cart = req.cookies.cart;
  cart.push(product);
  res.cookie("cart",cart);
  res.redirect("/products");
});
router.get("/cart/remove/:id", async function (req, res, next) {
  let cart =[];
  if(req.cookies.cart) cart = req.cookies.cart;
  cart.splice(cart.findIndex((c) => c._id==req.params.id),1);
  res.cookie("cart",cart);
  res.redirect("/cart");
});
router.get("/cart/order/:id", async function (req, res, next) {
  let cart =[];
  if(req.cookies.cart) cart = req.cookies.cart;
  cart.splice(cart.findIndex((c) => c._id==req.params.id),1);
  res.cookie("cart",cart);
  res.redirect("/Order");
});
router.get("/edit/:id", async function (req, res, next) {
  let product = await Product.findById(req.params.id);
  res.render("products/edit",{ product });
});
router.post("/edit/:id", async function (req, res, next) {
  let product = await Product.findById(req.params.id);
  const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
  product.name = req.body.name;
  product.price = req.body.price;
  product.size = req.body.size;
  product.category = req.body.category;
  await product.save();
  res.redirect("/products");
});

module.exports = router;
