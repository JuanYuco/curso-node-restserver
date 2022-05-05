const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJwt } = require('../helpers/generateJwt');
const { googleVerify } = require('../helpers/googleVerify');

const login = async( req, res ) => {
    const { email, password } = req.body;
    const error = { msg: 'Usuario o contraseña incorrecta' };
    try {
        // Verificar si el email existe
        const user = await User.findOne({email});
        if ( !user ) {
            res.status(400).json(error);
            return;
        }
        
        // Verificar estado del usuario
        if ( !user.state ) {
            res.status(400).json(error);
            return;
        }

        // Verificar Cotraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            res.status(400).json(error);
            return;
        }

        // Generar el JWT
        const token = await generateJwt( user.id );
        res.json({
            token
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async( req, res ) => {
    const { id_token } = req.body;
    try {
        const { email, name, img } = await googleVerify( id_token );
        let user = await User.findOne({ email });
        if ( !user ) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true,
                role: 'USER_ROLE'
            }

            user = new User( data );
            await user.save();
        }

        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        const token = await generateJwt( user.id );

        res.json({
            msg: 'Ok',
            token,
            user
        });
    } catch ( error ) {
        console.log(error);
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}