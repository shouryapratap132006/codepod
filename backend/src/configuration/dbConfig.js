import mongoose from "mongoose";

mongoose.connect("mongodb+srv://bineetkeshari2024_db_user:Bineet123@cluster0.xcr9aor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

mongoose.connection.on("connected",()=>{
    console.log("Connected to MongoDB");
    
})

mongoose.connection.on("error",(error)=>{
    console.log(`MongoB connection error:${error}`);
    
})

export default mongoose;