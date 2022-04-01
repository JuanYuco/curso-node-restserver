const { response } = require('express');

const usersGet = ( req, res = response ) => {
    const { q, nombre, apiKey, page = 1, limit = 10 } = req.query;
    res.json({
        "msg": "get Api",
        q,
        nombre,
        apiKey,
        page,
        limit
    });
}

const usersPut = (req, res = response ) => {
    const id = req.params.id;
    res.status(400).json({
        "msg": "put Api",
        id
    });
}

const usersPost = (req, res = response ) => {
    const { nombre, edad } = req.body; 
    res.status(201).json({
        "msg": "post Api",
        nombre,
        edad
    });
}

const usersDelete = (req, res = response ) => { 
    res.json({
        "msg": "delete Api"
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}