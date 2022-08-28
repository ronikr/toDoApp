const express = require("express");
const mongoose = require("mongoose")
const uri = "mongodb+srv://ronik:fun123fun777@cluster0.igxouv6.mongodb.net/?retryWrites=true&w=majority";

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );

} catch (e) {
  console.log("could not connect");
}