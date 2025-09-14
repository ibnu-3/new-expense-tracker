import jwt from "jsonwebtoken"
import 'dotenv/config'

const generateToken =(id, res)=>{
  const token = jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:'7d'})
  res.cookie('jwt',token,{
    httpOnly: true,
    secure:true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}
export default generateToken;