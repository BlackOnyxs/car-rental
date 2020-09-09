const jsonWebToken = require('jsonwebtoken');

//====================
// Token Verify
//====================
let tokenVerify = (req, res, next) => {

    let token = req.get('token');

    jsonWebToken.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token is not valid'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
}

//====================
// Admin role Verify
//====================

let adminRoleVerify = (req, res, next) => {
    let role = req.user.role;

    if (role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'You do not have permission for this action'
            }
        });
    }
}


module.exports =  {
    tokenVerify,
    adminRoleVerify,
};