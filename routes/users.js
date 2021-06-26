var express = require("express");
var router = express.Router();
var { User,validate } = require("../models/user");


router.get("/register", function (req, res, next) {
	res.render("users/register");
});

router.post("/register", async function (req, res, next) {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	let user = new User(req.body);
	await user.save();
	res.redirect("/");
});

router.get("/login", function (req, res, next) {
	res.render("users/login");
});

router.post("/login", async function (req, res, next) {
	let user = await User.findOne({
		email: req.body.email,
		password: req.body.password,
	});
	if (!user) return res.redirect("/login");
	req.session.user = user;
	return res.redirect("/");
});

router.get("/logout", function (req, res, next) {
	req.session.user = null;
	res.redirect("/login");
});
module.exports = router;
