// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from 'razorpay'
// import dotenv from 'dotenv';
// dotenv.config();
// const stripe =new Stripe(process.env.STRIPE_SECRET_KEY);

// const placeOrder = async (req, res) => {
//     const frontend_url= 'http://localhost:5173'
   
//     try {
//         const newOrder = new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })

//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })

//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })

//         res.json({success:true,session_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// const verifyOrder = async (req,res) => {
//     const {orderId,success} = req.body;
//     try {
//         if(success =="true"){
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({success:true,message:"paid"})
//         }else{
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"not paid"})
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// //user orders for frontend
// const userOrders = async (req,res) => {
//     try {
//         const orders = await orderModel.find({userId:req.body.userId});
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }


// //Listing orders for admin panel 
// const listOrders = async (req,res) => {
//     try {
//         const orders = await orderModel.find({});
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// //updating the status
// const updateStatus = async (req,res) => {
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
//         res.json({success:true,message:"Status updated"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}


// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";
// import dotenv from "dotenv";

// dotenv.config();


// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });



// // Place Order

// const placeOrder = async (req, res) => {

//     try {
//         const frontend_url = "http://localhost:5173";
//         const newOrder = new orderModel({

//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address
//         });


//         await newOrder.save();

//         await userModel.findByIdAndUpdate(
//             req.body.userId,
//             {
//                 cartData:{}
//             }
//         );



//         // Create Razorpay Order

//         const options = {
//             amount: req.body.amount * 100,
//             currency:"INR",
//             receipt:`order_${newOrder._id}`
//         };


//         const razorpayOrder = await razorpay.orders.create(options);



//         res.json({
//             success:true,
//             order:razorpayOrder,
//             orderId:newOrder._id,
//             key:process.env.RAZORPAY_KEY_ID
//         });



//     } catch(error){
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Error"
//         });

//     }

// };





// // Verify Order

// const verifyOrder = async(req,res)=>{
//     const {orderId,success}=req.body;
//     try{
//         if(success==="true"){
//             await orderModel.findByIdAndUpdate(
//                orderId,
//               {
//                     payment:true
//                 }

//             );


//             res.json({

//                 success:true,

//                 message:"Paid"

//             });


//         }

//         else{


//             await orderModel.findByIdAndDelete(orderId);


//             res.json({

//                 success:false,

//                 message:"Payment Failed"

//             });

//         }



//     }catch(error){

//         console.log(error);


//         res.json({

//             success:false,

//             message:"Error"

//         });

//     }


// };





// // User Orders

// const userOrders = async(req,res)=>{

//     try{

//         const orders = await orderModel.find({

//             userId:req.body.userId

//         });


//         res.json({

//             success:true,

//             data:orders

//         });


//     }catch(error){

//         console.log(error);


//         res.json({

//             success:false,

//             message:"Error"

//         });

//     }

// };





// // Admin Orders

// const listOrders = async(req,res)=>{

//     try{


//         const orders = await orderModel.find({});


//         res.json({

//             success:true,

//             data:orders

//         });



//     }catch(error){


//         console.log(error);


//         res.json({

//             success:false,

//             message:"Error"

//         });


//     }

// };





// // Update Status

// const updateStatus = async(req,res)=>{

//     try{


//         await orderModel.findByIdAndUpdate(

//             req.body.orderId,

//             {
//                 status:req.body.status
//             }

//         );


//         res.json({

//             success:true,

//             message:"Status updated"

//         });



//     }catch(error){


//         console.log(error);


//         res.json({

//             success:false,

//             message:"Error"

//         });

//     }

// };



// export {
//     placeOrder,
//     verifyOrder,
//     userOrders,
//     listOrders,
//     updateStatus
// };




// import Razorpay from "razorpay";
// import crypto from "crypto";
// import orderModel from "../models/orderModel.js";

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Step 1: place order + create Razorpay order
// const placeOrder = async (req, res) => {
//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();

//     const options = {
//       amount: Math.round(req.body.amount * 100), // paise
//       currency: "INR",
//       receipt: newOrder._id.toString(),
//     };

//     const razorpayOrder = await razorpayInstance.orders.create(options);

//     res.json({
//       success: true,
//       order: razorpayOrder,
//       dbOrderId: newOrder._id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, message: "Error placing order" });
//   }
// };

// // Step 2: verify payment signature after user pays
// const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       await orderModel.findByIdAndUpdate(dbOrderId, { payment: true });
//       res.json({ success: true, message: "Payment verified" });
//     } else {
//       await orderModel.findByIdAndDelete(dbOrderId);
//       res.json({ success: false, message: "Invalid signature" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, message: "Verification failed" });
//   }
// };

// const userOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId });
//     res.json({ success: true, data: orders });
//   } catch (err) {
//     res.json({ success: false, message: "Error fetching orders" });
//   }
// };

// export { placeOrder, verifyPayment, userOrders };


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Place order + create Razorpay order
// const placeOrder = async (req, res) => {
//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();

//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     const options = {
//       amount: Math.round(req.body.amount * 100), // paise
//       currency: "INR",
//       receipt: `order_${newOrder._id}`,
//     };
//     console.log("KEY:", process.env.RAZORPAY_KEY_ID);
// console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing");
//     const razorpayOrder = await razorpay.orders.create(options);

//     res.json({
//       success: true,
//       order: razorpayOrder,
//       orderId: newOrder._id,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
const placeOrder = async (req, res) => {
  console.log("STEP 1: placeOrder started, body =", JSON.stringify(req.body));

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    console.log("STEP 2: about to save order");
    await newOrder.save();
    console.log("STEP 3: order saved, id =", newOrder._id);

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    console.log("STEP 4: cart cleared");

    const options = {
      amount: Math.round(req.body.amount * 100),
      currency: "INR",
      receipt: `order_${newOrder._id}`,
    };

    console.log("STEP 5: creating razorpay order with options =", options);
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("STEP 6: razorpay order created =", razorpayOrder.id);

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("❌ ERROR CAUGHT:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify payment signature — this is the security-critical step
const verifyOrder = async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    // console.log(error);
    // res.json({ success: false, message: "Error verifying payment" });
    // } catch (error) {
  console.log(error);
  res.json({ success: false, message: error.message }); // 👈 temporary — shows real reason

  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

export { placeOrder, verifyOrder, userOrders };