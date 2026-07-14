import jwt from "jsonwebtoken"
const auth=async(req,res,next)=>{
const {token}=req.headers;
if(!token){
    return res.json({success:false,message:"Not Authorized Login Again"})
}

try {
    const tkdecode=jwt.verify(token,process.env.JWT_SECRET);
    req.body.userId=tkdecode.id;
    next();
} catch (error) {
    res.json({success:false,message:"Error"})
}
}

export default auth;