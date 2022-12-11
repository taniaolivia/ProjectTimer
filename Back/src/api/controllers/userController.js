const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios")

// Inscription d'utilisateur
exports.userRegister = (req, res, error) => {
    let newUser = new User(req.body);

    if(newUser.password){
        bcrypt.hash(newUser.password, 10, (error, hash) => {
            if(error){
                res.status(401);
                console.log(error);
                res.json({message: "Impossible de crypter le mot de passe"});
            }
            else{
                newUser.password = hash;

                newUser.save((error, user) => {
                    if(error){
                        res.status(401);
                        console.log(error);
                        res.json({message: "Rêquete invalide"});
                    }
                    else{
                        res.status(200);
                        res.json({message: `Utilisateur crée : ${user.email}`});
                    }
                });
            }
        })
    }
    else{
        res.status(401);
        res.json({message: "Mot de passe est vide"});
        console.log(error);
    }
}

// Connexion d'utilisateur
exports.userLogin = (req, res, error) => {
    User.findOne({email: req.body.email}, (error, user) => {
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Utilisateur non trouvé"});
        }
        else{
            if(user.email == req.body.email){
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if(error){
                        res.status(401);
                        console.log(error);
                        res.json({message: "Mot de passe incorrect"})
                    }
                    else{
                        if(!user.connected){
                           user.connected = 1;

                           user.save((error, user) => {
                                if(error){
                                    res.status(401);
                                    console.log(error);
                                    res.json({message: "Rêquete invalide"});
                                }
                                else{
                                    let userData = {
                                        id: user._id.toString(),
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        admin: user.admin,
                                        connected: 1
                                    }
                
                                    jwt.sign(userData, process.env.JWT_KEY, {expiresIn: "30 days"}, (error, token) => {
                                        if(error){
                                            res.status(500);
                                            console.log(error);
                                            res.json({message: "Impossible de générer le token"})
                                        }
                                        else{
                                            res.status(200);
                                            res.json({message: `Utilisateur connecté : ${user.email}`, token, user: userData});
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            res.status(401);
                            console.log(error);
                            res.json({message: "Utilisateur est déjà connecté"});
                        }
                    }
                })
            }
            else{
                res.status(401);
                res.json({message: "Email ou mot de passe incorrect"});
                console.log(error);
            }
        }
    })
}

// Déconnexion d'utilisateur
exports.userLogout = (req, res, error) => {
    if(req.params.userId){
        User.findById(req.params.userId, (error, user) => {
            if(error){
                res.status(401);
                console.log(error);
                res.json({message: "Utilisateur connecté non trouvé"});
            }
            else{
                if(user.connected){
                    user.connected = 0;

                    user.save((error, user) => {
                        if(error){
                            res.status(401);
                            console.log(error);
                            res.json({message: "Rêquete invalide"});
                        }
                        else{
                            res.status(200);
                            res.json({message: `Utilisateur déconnecté : ${user.email}`});
                        }
                    });
                }
                else {
                    res.status(401);
                    console.log(error);
                    res.json({message: 'Utilisateur connecté non trouvé'});
                }
            }
        })
    }
    else {
        res.status(401);
        console.log(error);
        res.json({message: 'Utilisateur connecté non trouvé'});
    }
}

// Afficher tous les utilisateurs
exports.listAllUsers = (req, res) => {
    User.find({}, (error, users) => {
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Erreur serveur"});
        }
        else{
            res.status(200);
            res.json(users);
        }
    });
}

// Afficher un utilisateur par id
exports.aUser = (req, res) => {
    User.findById(req.params.userId, (error, user) => {
        if(error){
            res.status(401);
            res.json({message: "Utilisateur connecté non trouvé"});
            console.log(error);
        }
        else{
            res.status(200);
            res.json(user);
        }
    });
}
exports.aUserMail = (req,res)=>{
    User.findOne({email: req.body.email}, async (error, user) => {
        if(error){
            res.status(401);
            res.json({message: "Utilisateur non trouvé"});
            console.log(error);
        }else{
            res.status(200);
            res.json(user);
        }
    })
}