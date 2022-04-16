const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const usersGet = async( req, res = response ) => {
    const { limit = 5, start = 0 } = req.query;
    const query = { state: true };

    const [ users, total ] = await Promise.all([
        User.find(query)
            .skip( Number(start) )
            .limit( Number(limit) ),
        User.countDocuments(query)
    ]);
    res.json({
        total,
        users
    });
}

const usersPut = async(req, res = response ) => {
    const id = req.params.id;
    const { _id, password, google, ...body } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, body );

    res.status(400).json(user);
}

const usersPost = async(req, res = response ) => {
    const { name, email, password, role } = req.body;
    const user = new User({
        name,
        email,
        password,
        role
    });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();
    res.status(201).json(user);
}

const usersDelete = async(req, res = response ) => {
    const { id } = req.params;
    // Borrar fisicamente
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { state: false } );
    res.json(user);
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}