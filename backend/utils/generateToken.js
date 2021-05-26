import jwt from 'jsonwebtoken';

// create a function that's going to take in (as an argument) the user's id that we want to add as the payload in this token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // the payload is the id , expires in 30 days
};

export default generateToken;