const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

const app = express();

const { tokenVerify, adminRoleVerify } = require('../middlewares/authentication');

app.get('/user', tokenVerify, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({state: true}, 'name lastname cid age email history role')
        .skip(from)
        .limit(limit)
        .exec( (err, users ) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, counter) => {

                res.json({
                    ok: true,
                    users,
                    counter
                });
            });

        });
});

app.get('/user/:id', [tokenVerify, adminRoleVerify], (req, res) => {
    let id = req.params.id;

    User.findById(id)
            .exec( (err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!userDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'ID not exist'
                        }
                    });
                }
                res.json({
                    ok: true,
                    user: userDB
                });
            });
});


app.post('/user', (req, res) => {

    let body = req.body;

    let user = new User({
        names     : body.names,
        lastName  :  body.lastName,
        cid       : body.cid,
        age       : body.age,
        email     :  body.email,
        password  : bcrypt.hashSync(body.password, 10),
        cellphone : body.cellphone,
        role      : body.role
    });

    user.save( (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });
});

app.put('/user/:id', tokenVerify, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['lastName','cid','age','cellphone img']);


    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !userDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not exist'
                }
            });
        }
        
        if( id != userDB._id ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'You do not have permission for this action.'
                }
            });
        }


        res.json({
            ok: true,
            user: userDB
        });

    });
});

app.delete('/user/:id', [tokenVerify, adminRoleVerify], (req, res) => {

    let id = req.params.id;

    let changeState = {
        state: false
    }

    User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDelete) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found.'
                }
            });
        }
        res.json({
            ok: true,
            user: userDelete
        });
    });
});
module.exports = app;
