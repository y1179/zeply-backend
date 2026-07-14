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


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});



// Place Order

const placeOrder = async (req, res) => {

    try {
        const frontend_url = "http://localhost:5173";
        const newOrder = new orderModel({

            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });


        await newOrder.save();

        await userModel.findByIdAndUpdate(
            req.body.userId,
            {
                cartData:{}
            }
        );



        // Create Razorpay Order

        const options = {
            amount: req.body.amount * 100,
            currency:"INR",
            receipt:`order_${newOrder._id}`
        };


        const razorpayOrder = await razorpay.orders.create(options);



        res.json({
            success:true,
            order:razorpayOrder,
            orderId:newOrder._id,
            key:process.env.RAZORPAY_KEY_ID
        });



    } catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        });

    }

};





// Verify Order

const verifyOrder = async(req,res)=>{
    const {orderId,success}=req.body;
    try{
        if(success==="true"){
            await orderModel.findByIdAndUpdate(
               orderId,
              {
                    payment:true
                }

            );


            res.json({

                success:true,

                message:"Paid"

            });


        }

        else{


            await orderModel.findByIdAndDelete(orderId);


            res.json({

                success:false,

                message:"Payment Failed"

            });

        }



    }catch(error){

        console.log(error);


        res.json({

            success:false,

            message:"Error"

        });

    }


};





// User Orders

const userOrders = async(req,res)=>{

    try{

        const orders = await orderModel.find({

            userId:req.body.userId

        });


        res.json({

            success:true,

            data:orders

        });


    }catch(error){

        console.log(error);


        res.json({

            success:false,

            message:"Error"

        });

    }

};





// Admin Orders

const listOrders = async(req,res)=>{

    try{


        const orders = await orderModel.find({});


        res.json({

            success:true,

            data:orders

        });



    }catch(error){


        console.log(error);


        res.json({

            success:false,

            message:"Error"

        });


    }

};





// Update Status

const updateStatus = async(req,res)=>{

    try{


        await orderModel.findByIdAndUpdate(

            req.body.orderId,

            {
                status:req.body.status
            }

        );


        res.json({

            success:true,

            message:"Status updated"

        });



    }catch(error){


        console.log(error);


        res.json({

            success:false,

            message:"Error"

        });

    }

};



export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
};