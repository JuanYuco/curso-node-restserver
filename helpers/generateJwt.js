const jwt = require('jsonwebtoken');

const generateJwt = ( uid = '' ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1h'
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' );
                return;
            }

            resolve( token );
        });
    });
}

module.exports = {
    generateJwt
}