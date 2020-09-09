const express = require('express');
const _ = require('underscore');
const Car     = require('../models/car');

const app = express();

const { tokenVerify, adminRoleVerify } = require('../middlewares/authentication');

app.get('/car', (req, res)=>{
    Car.find({}, 'title engine')
        .exec( (err, cars)=>{
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                cars
            });
        });
});

app.post('/car', [tokenVerify, adminRoleVerify], (req, res)=> {

    let  body = req.body;

    let car = new Car({
        title              : body.title,
        name               : body.name,
        engine             : body.engine,
        passenger          : body.passenger,
        dailyRate          : body.dailyRate,
        weeklyRate         : body.weeklyRate,
        collisionCoverage  : body.collisionCoverage,
        thirdDamage        : body.thirdDamage,
        type               : body.type,
        features           : body.features,
        description        : body.description
    });

    car.save( (err, carDB) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            car: carDB
        });

    });
});

 app.put('/car/:id', [tokenVerify, adminRoleVerify], (req,res) => {
    
    let id   = req.params.id;
    let body = req.body;

    Car.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, carDB) => {
        
        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            car: carDB
        });
    });

});

app.delete('/car/:id', [tokenVerify, adminRoleVerify], (req, res) => {
    let id = req.params.id;

    let changeState = {
        state: false
    }
    Car.findByIdAndUpdate(id, changeState, { new: true }, (err, carDeleted) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!carDeleted) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Car not found.'
                }
            });
        }

        res.json({
            ok: true,
            car: carDeleted
        });
    });
});


module.exports = app;