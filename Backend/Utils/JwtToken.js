import jwt from 'jsonwebtoken';


const generateToken = (id) =>{
    const  token = jwt.sign({id}, process.env.JWT_KEY, {
        expiresIn: '30d'

    })
    return token;
}

export default generateToken;