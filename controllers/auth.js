const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJwt } = require('../helpers/generateJwt');

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

module.exports = {
    login
}