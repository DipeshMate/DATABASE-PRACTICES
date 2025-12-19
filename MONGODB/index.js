const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const Port = 8010;
const app = express();

//it will handle the error from the frontend body.

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

//create a connection with a server

mongoose.connect("mongodb://localhost:27017/product").then(() => {
    console.log(`Connected successfully with the server`);
}).catch((err) => {
    console.log(err);
});

//create a schema

const productSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price: Number
});

//create a collection/Model

const Product = mongoose.model("product", productSchema);

app.listen(Port, () => {
    console.log(`Server is Running On http://localhost:${Port}`);
});

//creating a Product API

app.post("/api/v1/products/new", async (req, res) => {
    const product = await Product.create(req.body);

    if (!product){
        return res.status(500).json({
            success: false,
            message:"Product not found"
        });
    };

    res.status(201).json({
        success: true,
        product
    });
})

//Reading an Api

app.get("/api/v1/products", async (req, res) => {
    
    const product = await Product.find();

    if (!product){
        return res.status(500).json({
            success: false,
            message:"No Products found"
        });
    };

    res.status(201).json({
        success: true,
        product
    });

})

//delete a product

app.delete("/api/v1/product/:id",async (req,res) => {
    const product = await Product.findById(req.params.id);
    
    
    if (!product){
        return res.status(500).json({
            success: false,
            message:"No Products found"
        });
    };
    await Product.deleteOne();
    
    res.status(201).json({
        success: true,
        message:"Product is deleted Succesfully"
    });

})

//updating the product

app.put("/api/v1/product/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product){
        return res.status(450).json({
            success: false,
            message:"No Products found"
        });
    };

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true,
    });

    res.status(450).json({
        success: true,
        message: "Product is updated Succesfully",
        product
    });
    
})
