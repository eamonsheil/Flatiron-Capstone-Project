const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, password_confirmation } = req.body
    console.log(req.body)
    if (!name || !email || !password || !password_confirmation){
        res.status(400).send({message: 'Please complete all fields'})
    }
        // check if user exists
    const userExists = await User.findOne({email})
   
    if (userExists) {
        res.status(400).send({message: 'User already exists'})
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
        })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } 
    else {
        res.status(400).send({message: 'Invalid user data'})
    }
})


const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    // check for a user with that email
    const user = await User.findOne({email})
    // if user is found, compare encrypted pwds w/"bcrypt.compare"


    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);
        
        return res
            .cookie("token", token, {
                httpOnly: true
            })
            .json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: token
            })
    } else {
        res.status(400).send({message: 'Invalid credentials'})
    }
})

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
    // const { id, name, email } = await User.findById(req.user.id)
    
    // res.status(200).json({
    //     id: id,
    //     name: name,
    //     email: email
    // })
})

const logoutUser = asyncHandler(async (req, res) => {
    return res
        .clearCookie('token')
        .status(200)
        .json({message: "successfully logged out"});
});


// Generate JWT, ---> takes in user id
// this will be returned with other user data on register/login
const generateToken = (id) => {
    // jwt.sign takes in payload (data we want to put in there) - the id
    // second is the secret (environmental var)
    // third is a hash of options, here we set the token to expire in 1 hour
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
}