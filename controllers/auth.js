const { response } = require('express');
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const User = require('../models/Users-model');
const { use } = require('../routes/auth');
const { generarJWT } = require('../helpers/jwt');

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
    
    //encryptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt)

    await user.save();
    //generate JWT
    const token = await generarJWT( user.id, user.name );
    
    res.status(201).json({
        ok: true,
        uid: user.id,
        name: user.name,
        token
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
        ok: false,
        msg: 'please contact the administration'
    })
    
  }


}

const loginUser = async ( req,res = response ) => {

    const { email, password }= req.body;

    try {

        let user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'the user does not exist'
            })
        }
        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, user.password);

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //generate JWT
        const token = await generarJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Server error'
        });
    }

    res.json({
        ok: true,
        msg: 'login',
        email,
        password
    })
}

const revalidateToken = async ( req,res = response ) => {

    const {uid, name} = req;

    //generate new JWT and return in this http
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}