const cors = require('cors');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const express = require('express');

//CREATE EXPRESS APP
const app = express();
app.use(cors({ origin: '*' }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json());

// DECLARE JWT-secret SENSITIVE:
const JWT_Secret = process.env.JWT_Secret;
const testUser = { email: process.env.USERemail, password: process.env.USERpassword };

app.post('/api/authenticate', (req, res) => {

    if (req.body) {
        const user = req.body;
        console.log(user)

        bcrypt.hash(req.body.password, 10, function(err, hash) {
            console.log('Password hash: ', hash);
            
            bcrypt.compare(req.body.password, hash, function(err, result) {

                console.log('ANTES: ', result, req.body.email, testUser.email, req.body.password, testUser.password, user);

                if (result && testUser.email === req.body.email && testUser.password === req.body.password) {

                    const token = jwt.sign(user, JWT_Secret, { expiresIn: 120 });
                    
                    console.log('DEPOIS: ', req.body.email, req.body.password, token);

                    res.status(200).send({
                        email: req.body.email,  // => DON'T show email/password; does not go to the front (req.body.password)...
                        token: token
                    });

                } else {
                    res.status(403).send({
                        errorMessage: 'Authorisation required!'
                    });
                }

            })
        });
    } else {
        res.status(403).send({
            errorMessage: 'Please provide email and password'
        });
    }

});

const PORT = process.env.PORT || 47236;
app.listen(PORT, () => console.log('Server started on port ' + PORT + '!'));

// POST <webservice>/login
// POST <webservice>/profile