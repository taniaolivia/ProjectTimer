const Group = require("../models/groupModel");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Créer un nouveau groupe
exports.createGroup = (req, res) => {   
    axios.get("http://localhost:3000/users/" + req.params.userId).then(result => {   
        let newGroup = new Group({
            name: req.body.name, 
            users: result.data.email, 
            admin: result.data.email
        });

        newGroup.save((error, group) => {
            if(error){
                res.status(401);
                console.log(error);
                res.json({message: "Rêquete invalide"});
            }
            else{
                axios.get("http://localhost:3000/users/" + req.params.userId).then(result1 => {
                    let groups = result1.data.groups;
                    groups.push(group.name);

                    axios.patch("http://localhost:3000/users/" + req.params.userId, {groups: groups}).then(result2 => {
                        jwt.sign(result2.data.result, process.env.JWT_KEY, { expiresIn: "30 days" }, (error, token) => {
                            if (error) {
                                res.status(500);
                                console.log(error);
                                res.json({ message: "Impossible de générer le token" })
                            }
                            else {
                                res.status(200);
                                res.json({message: `Groupe crée : ${group.name}`, groupData: newGroup, token});
                            }
                        });
                    })
                })
            }
        });   
    })
}   

// Afficher tous les groupes
exports.getAllGroups = (req, res) => {
    Group.find({}, (error, groups) =>{
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Erreur serveur"});
        }
        else{
            res.status(200);
            res.json(groups);
        }
    });
}

// Afficher un groupe par id
exports.getGroupById = (req, res) => {
    Group.findById(req.params.groupId, (error, group) =>{
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Groupe non trouvé"});
        }
        else{
            res.status(200);
            res.json(group);
        }
    });
}

// Supprimer un groupe par id
exports.deleteGroupById = (req, res) => {
    Group.findByIdAndDelete(req.params.groupId, (error, group) =>{
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Groupe non trouvé"});
        }
        else{
            res.status(200);
            res.json({message: `Groupe supprimé: ${group.name}`});
        }
    });
}

// Ajouter les utilisateurs voulus dans un groupe
exports.addUsers = (req, res) => {
    Group.findById({_id: req.params.groupId}, (error, group) => {
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Groupe non trouvé"});
        }
        else{
            let groupUsers = group.users;

            req.body.users.map(user => {
                if(!groupUsers.includes(user)){
                    groupUsers.push(user);

                    Group.findByIdAndUpdate({_id: req.params.groupId}, {users: groupUsers}, {new: true}, (error, groupUpdate) => {
                        axios.get("http://localhost:3000/users").then(async result2 => {
                            await req.body.users.map(user => {
                                result2.data.map(datas => {
                                    if(datas.email == user){
                                        let groups = datas.groups;
                                        groups.push(group.name);
    
                                        axios.patch("http://localhost:3000/users/" + datas._id, {groups: groups});
                                    }
                                });
                            })
                        })
                    });
                }
            })
            res.status(200);
            res.json({message: `${group.name} est bien modifié`})
        }
    }) 
}

// Supprimer les utilisateurs voulus dans un groupe
exports.deleteUsers = (req, res) => {
    Group.findById({_id: req.params.groupId}, (error, group) => {
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Groupe non trouvé"});
        }
        else{
            let groupUsers = group.users;

            req.body.users.map(user => {
                if(groupUsers.includes(user)){
                    groupUsers = groupUsers.filter(group1 => !req.body.users.includes(group1))
                    
                    Group.findByIdAndUpdate({_id: req.params.groupId}, {users: groupUsers}, {new: true}, (error, groupUpdate) => {
                        axios.get("http://localhost:3000/users").then(async result => {
                            await req.body.users.map(user => {
                                result.data.map(datas => {
                                    if(datas.email == user){
                                        let groups = datas.groups;
                                        groups = groups.filter(group2 => group2 != groupUpdate.name)

                                        axios.patch("http://localhost:3000/users/" + datas._id, {groups: groups});
                                    }
                                });
                            })
                        })
                    });
                }
            })
            res.status(200);
            res.json({message: `${group.name} est bien modifié`})
        }
    }) 
}