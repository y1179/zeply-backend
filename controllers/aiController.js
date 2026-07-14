import Groq from "groq-sdk";
import { food_list } from "../config/foodList.js";


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const recommendFood = async(req,res)=>{

    try{

        const {query}=req.body;


        const menu = food_list
        .map(food=>food.name)
        .join(",");



        const response = await groq.chat.completions.create({

            messages:[
                {
                    role:"system",
                    content:
                    `
                    You are a food recommendation assistant.

                    Available food:
                    ${menu}

                    Recommend only foods from this list.

                    User request:
                    ${query}

                    Return only food names separated by comma.
                    `
                }
            ],

            model:"llama-3.1-8b-instant"

        });



        const result =
        response.choices[0].message.content;


        const recommendations =
        result.split(",").map(item=>item.trim());


        res.json({
            success:true,
            recommendations
        })


    }
    catch(error){

        console.log(error);

        res.json({
            success:false,
            message:"AI error"
        })
    }

}


export {recommendFood};