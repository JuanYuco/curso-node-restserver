const validationAdminRole = ( req, res, next ) => {
    if ( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token antes'
        });
    }

    const { role, name } = req.user;
    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } no es administrador`
        });
    }

    next();
}

const validationHaveRole = ( ...roles ) => {
    return ( req, res, next ) => {
        if ( !req.user ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token antes'
            });
        }

        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg: 'No cumple los permisos necesarios para realizar esta acción'
            });
        }

        next();
    }
}

module.exports = {
    validationAdminRole,
    validationHaveRole
}