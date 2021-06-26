var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

function validateUser(user) {
	const schema =Joi.object( {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});

	return schema.validate(user, { abortEarly: false });
}

exports.User = User;
exports.validate = validateUser;