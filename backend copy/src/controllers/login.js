import authService from "../services/login.js";

export default async function login(req,res) {
    try{
        const {email,password} = req.body
        const token = await authService(email,password);
        res.json({token:token})
    }catch(error){
        console.log("Error",error.message)
        res.status(401).json("Invalid credentials")
    }
}
