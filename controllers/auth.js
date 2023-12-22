const { response } = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/Users-model');
const { use } = require('../routes/auth');

const createUser = async (req,res = response ) => {

   const { email, password }= req.body;

  try {
    let user = await User.findOne({ email });
    if ( user ) {
        return res.status(400).json({
            ok: false,
            msg: 'the user exists with this email'
        })
    }
    
    user = new User( req.body );
    
    await user.save();
    
    res.status(201).json({
        ok: true,
        uid: user.id,
        name: user.name
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
        ok: false,
        msg: 'please contact the administration'
    })
    
  }


}

const loginUser = ( req,res = response ) => {

    const { email, password }= req.body;

    res.json({
        ok: true,
        msg: 'login',
        email,
        password
    })
}

const revalidateToken = ( req,res = response ) => {
    res.json({
        ok: true,
        msg: 'renew'
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}