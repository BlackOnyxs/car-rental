const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use( fileUpload({ useTempFiles: true }) );

const { tokenVerify, adminRoleVerify } = require('../middlewares/authentication');

const User = require('../models/user');
const Car = require('../models/car');

app.put('/upload/:type/:id', tokenVerify, (req, res) => {

    let type = req.params.type;
    let id   = req.params.id;
    console.log(process.env.CLOUDINARY_CLOUD_NAME);

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            message: 'No files were uploaded'
        });
    } 

    let validTypes = ['car', 'user'];
    if ( !validTypes.includes(type) ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Only ${validTypes.join(', ')} are accepted`
            }
        });
    }

    let sampleFile = req.files.sampleFile;

    const validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    if (!validExtensions.includes(sampleFile.mimetype)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Only ${validExtensions.join(', ')} are accepted`
            }
        });
    }

    cloudinary.uploader.upload(sampleFile.tempFilePath, (err, result) => {
        
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if ( type === 'user' ){
            userImage(id, res, result.url, sampleFile.tempFilePath);
        }else if( type === 'car' ) {
            carImage(id, res, result.url, sampleFile.tempFilePath);
        }
        
    });
});

function userImage(id, res, url, fileName ) {

    User.findById(id, (err, userDB) => {
        if( err ) {
            deleteImage(fileName);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !userDB ) {
            deleteImage(fileName);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found.'
                }
            });
        }

        userDB.img = url;

        userDB.save( (err, userSaved) => {

            if( err ) {
                deleteImage(fileName);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            deleteImage(fileName);
            res.json({
                ok: true,
                user: userSaved,
                url: url
            });
        });

        
    });
}
function carImage(id, res, url, fileName) {

    Car.findById(id, (err, carDB) => {
        if( err ) {
            deleteImage(fileName);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !carDB ) {
            deleteImage(fileName);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Car not found.'
                }
            });
        }

        carDB.img = url;

        carDB.save( (err, carSaved) => {

            if( err ) {
                deleteImage(fileName);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            deleteImage(fileName);

            res.json({
                ok: true,
                car: carSaved,
                url: url
            });
        });

        
    });
}

function deleteImage(fileName){
    const pathImage = path.resolve(__dirname, `../../temp/${ fileName }`);
    if( fs.existsSync(pathImage) ) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;