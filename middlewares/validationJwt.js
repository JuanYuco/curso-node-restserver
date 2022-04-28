const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validationJwt = async( req, res, next ) => {
    const token = req.header("x-token");
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const authUser = await User.findById(uid);
        if ( !authUser || !authUser.state ) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        req.user = authUser;
        next();
    } catch( error ) {
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validationJwt
}