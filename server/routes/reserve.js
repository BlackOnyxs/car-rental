const express = require('express');

const app = express();

let Reserve = require('../models/reserve');
let User = require('../models/user');
const { tokenVerify, adminRoleVerify } = require('../middlewares/authentication');

app.get('/reserve', tokenVerify, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    Reserve.find({ state: true })
            .skip(from)
            .limit(5)
            .populate('user', 'names lastname cid cellphone')
            .populate('car', 'name dailyRate weeklyRate')
            .exec( (err, reservesDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    reserves: reservesDB
                });
            });
});

app.get('/reserve/:id', tokenVerify, (req, res) => {
    let id = req.params.id;

    Reserve.findById(id)
            .populate('user', 'names lastname cid cellphone')
            .populate('car', 'name dailyRate weeklyRate')
            .exec( (err, reserveDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!reserveDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'ID not exist'
                        }
                    });
                }
                res.json({
                    ok: true,
                    reserveDB
                });
            });
});

app.post('/reserve', tokenVerify, (req, res) => {

    let userId = req.user._id;
    
    let body = req.body;


    let reseve = new Reserve({
        pickupLocation : body.pickupLocation,
        returnLocation : body.returnLocation,
        pickupDate     : body.pickupDate,
        returnDate     : body.returnDate,
        totalCost      : body.totalCost,
        car            : body.car,
        user           : userId,
        state          : body.state
    });

    reseve.save((err, reserveDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        User.findById(userId, (err, userDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            userDB.history.push(reserveDB._id);

            userDB.save((err, userSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    reserve: reserveDB
                });
            });

            
        });  

    });
});

app.put('/reserve/:id', [tokenVerify, adminRoleVerify], (req, res) => {
    let reserveId = req.params.id;
    let userId    = req.user._id;
    console.log(userId)
    let body = req.body;

    Reserve.findById(reserveId, (err, reserveDB) => {
        console.log(reserveDB.user);
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (!reserveDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Reserve not found.'
                }
            });
        }

        if( reserveDB.user != userId ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'You do not have permission for this action.'
                }
            });
        }

        reserveDB.pickupLocation = body.pickupLocation;
        reserveDB.returnLocation = body.returnLocation;
        reserveDB.pickupDate     = body.pickupDate;
        reserveDB.returnDate     = body.returnDate;
        reserveDB.totalCost      = body.totalCost;
        reserveDB.car            = body.car;
        reserveDB.state          = body.stat;

        reserveDB.save((err, reserveSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                reserve: reserveSave
            });
        });

    });
});


app.delete('/reserve/:id', tokenVerify, (req, res) => {

    let reserveId = req.params.id;

    Reserve.findById(reserveId, (err, reserveDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!reserveDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not exist.'
                }
            });
        }

        reserveDB.state = false;

        reserveDB.save((err, reserveSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                reseve: reserveSave,
                message: 'Reserve was delete.'
            })
        });
    });
});

module.exports = app;