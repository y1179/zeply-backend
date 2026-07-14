// import userModel from "../models/userModel.js";
// import jwt from 'jsonwebtoken';
// import bycrypt, { hash } from 'bcrypt'
// import validator from 'validator'



// //login user

// const loginUser=async(req,res)=>{
//      const {email,password}=req.body;
//      try {
//         const loguser = await userModel.findOne({email})
//         if(!loguser){
//             res.json({success:false,message:"User does not exist"})
//         }

//         const isMatch=await bycrypt.compare(password,loguser.password)
//          if(!isMatch){
//           return  res.json({success:false,message:"Invalid credentials"})
//          }

//          const token=createToken(loguser._id);
//          res.json({success:true,token})

//      } catch (error) {
//         res.json({success:false,message:"Error"})
//      }
// }

// const createToken=(id)=>{
//     return jwt.sign({id},process.env.JWT_SECRET)
// }

// const regUser=async(req,res)=>{
// const {name,email,password}=req.body;
// try {
//     //checking if already user exist
//     const user=await userModel.findOne({email:email});
//     if(user){
//         return res.json({success:false,message:"User Already Exist"})
//     }

//     //validating email format and  strong password

//     if(!validator.isEmail(email)){
//      return   res.json({success:false,message:"Please Enter Valid Email"})
//     }

// if(password.length<8){
//     return res.json({success:false,message:"Please Enter Strong Password"})
// }    

// //hashing user password
// const salt=await bycrypt.genSalt(10)
// const hash=await bycrypt.hash(password,salt)

// //create new user
// const newUser=new userModel({
//     name:name,
//     email:email,
//     password:hash,
//     })
// const reguser =await newUser.save();
// const token=createToken(reguser._id)
// res.json({success:true,token})



// } catch (error) {
//     res.json({success:false,message:"Error"})
// }
// }

// export {loginUser,regUser}


import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create Token
const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Login User
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: "Login Failed",
    });

  }
};

// Register User
const regUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "User Already Exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter Valid Email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = createToken(savedUser._id);

    return res.json({
      success: true,
      token,
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: "Registration Failed",
    });

  }

};

export { loginUser, regUser };