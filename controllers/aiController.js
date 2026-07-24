// import Groq from "groq-sdk";
// import { food_list } from "../config/foodList.js";


// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });


// const recommendFood = async(req,res)=>{

//     try{

//         const {query}=req.body;


//         const menu = food_list
//         .map(food=>food.name)
//         .join(",");



//         const response = await groq.chat.completions.create({

//             messages:[
//                 {
//                     role:"system",
//                     content:
//                     `
//                     You are a food recommendation assistant.

//                     Available food:
//                     ${menu}

//                     Recommend only foods from this list.

//                     User request:
//                     ${query}

//                     Return only food names separated by comma.
//                     `
//                 }
//             ],

//             model:"llama-3.1-8b-instant"

//         });



//         const result =
//         response.choices[0].message.content;


//         const recommendations =
//         result.split(",").map(item=>item.trim());


//         res.json({
//             success:true,
//             recommendations
//         })


//     }
//     catch(error){

//         console.log(error);

//         res.json({
//             success:false,
//             message:"AI error"
//         })
//     }

// }


// export {recommendFood};


// import Groq from "groq-sdk";
// import { food_list } from "../config/foodList.js";

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// const recommendFood = async (req, res) => {
//   try {
//     const { query } = req.body;

//     // Include price + category this time — the model needs this to reason at all
//     const menu = food_list
//       .map((food) => `${food.name} (₹${food.price}, ${food.category})`)
//       .join("; ");

//     const response = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a food recommendation assistant.

// Available food (name, price in rupees, category):
// ${menu}

// Based on the user's request, pick the best matching food items ONLY from this exact list.
// Consider taste style (spicy, healthy, dessert, etc.) and price if mentioned.
// Return ONLY the food names, separated by commas, with no extra text, no numbering, no explanation.
//           `,
//         },
//         {
//           role: "user",
//           content: query,
//         },
//       ],
//       model: "llama-3.1-8b-instant",
//       temperature: 0.2, // less randomness, more consistent picks
//     });

//     const result = response.choices[0].message.content;

//     let recommendations = result
//       .split(",")
//       .map((item) => item.trim())
//       .filter(Boolean);

//     // Safety net 1: only keep items that ACTUALLY exist in food_list
//     // (protects against the model inventing or slightly misspelling a name)
//     recommendations = recommendations.filter((name) =>
//       food_list.some(
//         (food) => food.name.toLowerCase() === name.toLowerCase()
//       )
//     );

//     // Safety net 2: if the query mentions a price limit, enforce it in code,
//     // since small LLMs are unreliable at numeric comparisons
//     const priceMatch = query.match(/under\s*(?:₹|rs\.?)?\s*(\d+)/i);
//     if (priceMatch) {
//       const limit = Number(priceMatch[1]);
//       recommendations = recommendations.filter((name) => {
//         const food = food_list.find(
//           (f) => f.name.toLowerCase() === name.toLowerCase()
//         );
//         return food && food.price <= limit;
//       });
//     }

//     res.json({
//       success: true,
//       recommendations,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: "AI error",
//     });
//   }
// };

// export { recommendFood };


import Groq from "groq-sdk";
import foodModel from "../models/foodModel.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const recommendFood = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.json({
        success: false,
        message: "Query is required",
      });
    }

    // Fetch latest menu from MongoDB
    const foods = await foodModel.find({});

    if (!foods.length) {
      return res.json({
        success: false,
        message: "No food items available",
      });
    }

    const search = query.toLowerCase();

    // -------------------------
    // CATEGORY FILTER
    // -------------------------

    const categoryMap = {
      salad: "Salad",
      healthy: "Salad",

      roll: "Rolls",
      rolls: "Rolls",

      dessert: "Deserts",
      desserts: "Deserts",
      sweet: "Deserts",

      cake: "Cake",

      pasta: "Pasta",

      noodle: "Noodles",
      noodles: "Noodles",

      sandwich: "Sandwich",

      veg: "Pure Veg",
      vegetarian: "Pure Veg",
    };

    let filteredFoods = foods;

    for (const key in categoryMap) {
      if (search.includes(key)) {
        filteredFoods = foods.filter(
          (item) =>
            item.category.toLowerCase() ===
            categoryMap[key].toLowerCase()
        );
        break;
      }
    }

    // -------------------------
    // PRICE FILTER
    // -------------------------

    const priceMatch = search.match(
      /(under|below|less than|max|within|cheaper than)\s*(₹|rs\.?)?\s*(\d+)/i
    );

    if (priceMatch) {
      const limit = Number(priceMatch[3]);

      filteredFoods = filteredFoods.filter(
        (item) => item.price <= limit
      );
    }

    if (filteredFoods.length === 0) {
      return res.json({
        success: true,
        recommendations: [],
      });
    }

    // -------------------------
    // MENU FOR AI
    // -------------------------

    const menu = filteredFoods
      .map(
        (food) =>
          `${food.name} (₹${food.price}, ${food.category})`
      )
      .join("\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      temperature: 0.2,

      messages: [
        {
          role: "system",
          content: `
You are a food recommendation assistant.

Available Menu:

${menu}

Rules:

1. Recommend ONLY foods from the menu.
2. Never invent food names.
3. Never recommend foods outside this list.
4. Recommend maximum 4 items.
5. Return ONLY comma separated food names.
          `,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const aiResponse = response.choices[0].message.content;

    let recommendations = aiResponse
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    recommendations = recommendations.filter((name) =>
      filteredFoods.some(
        (food) =>
          food.name.toLowerCase() === name.toLowerCase()
      )
    );

    // If AI returns nothing, return first matching foods
    if (recommendations.length === 0) {
      recommendations = filteredFoods
        .slice(0, 4)
        .map((item) => item.name);
    }

    return res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export { recommendFood };