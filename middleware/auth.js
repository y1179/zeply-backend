// import jwt from "jsonwebtoken"
// const auth=async(req,res,next)=>{
// const {token}=req.headers;
// if(!token){
//     return res.json({success:false,message:"Not Authorized Login Again"})
// }

// try {
//     const tkdecode=jwt.verify(token,process.env.JWT_SECRET);
//     req.body.userId=tkdecode.id;
//     next();
// } catch (error) {
//     res.json({success:false,message:"Error"})
// }
// }

// export default auth;


import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error); // <-- Add this
    return res.json({
      success: false,
      message: error.message, // <-- Show the real error
    });
  }
};

export default auth;