var mongoose= require("mongoose")
mongoose
.connect("mongodb+srv://irin:irinsajo@cluster0.rsru3.mongodb.net/Sample?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{console.log("Db connected")})
.catch((err)=>{ console.error(" DB Connection Failed:", err); });
