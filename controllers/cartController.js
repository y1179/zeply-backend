import userModel from '../models/userModel.js'

//add items to cart 

const addTocart=async(req,res)=>{
try {
let data=await userModel.findOne({_id:req.body.userId})
let cartData=await data.cartData;
if(!cartData[req.body.itemId]){
    cartData[req.body.itemId]=1;
}
else{
    cartData[req.body.itemId]+=1;
}

await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"Added To Cart"})

} catch (error) {
    res.json({success:false,message:"Error"})
}

}

//remove items from cart
const removeFromcart=async(req,res)=>{
try {
    let user=await userModel.findById(req.body.userId);
let cartData=await user.cartData;
if(cartData[req.body.itemId]>0){
cartData[req.body.itemId]-=1;
}

await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"Removed To Cart"})
} catch (error) {
    res.json({success:false,message:"Error"})
}
}


//fetch user cart data

const getCart=async(req,res)=>{
try {
   let user=await userModel.findById(req.body.userId);
   let cartData=await user.cartData;
   res.json({success:true,cartData})
} catch (error) {
    res.json({success:false,message:"Errors"})
}
}

export {addTocart,removeFromcart,getCart}