const express = require ('express');
const router = express.Router();
const Game = require('../models/game');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

router.get('/getGames', (req, res, next) => {
    Game.find({}, function(err,games){
        if(!err){
        res.status(200).json({
            message: "GET request to /getGames succeeded",
            games: games
        });
    }
    else{
        res.status(424).json({
            message: "GET request to /getGames failed"
        })
    }
    });
});

router.get('/getGame',(req, res) => {
    Game.find({_id:req.body._id}, function(err, game){
        if(!err){
            res.status(200).json({
                message: "GET request to getGame succeeded",
                game: game
            })
        }
        else{
            res.status(424).json({
                message: "GET request to getGame failed"
            })
        }
    })
})

router.post('/createGame', async(req, res, next) => {
    moment.tz('2020-12-05', 'America/Chicago').format('z');    // CST
    let today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
    let d = new Date();
    d.setDate(today);
    console.log("today: " + today);
    
    //TODO:Get Date and time from a form
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        // date: req.body.date,
        date: today,
        ageGroup: req.body.ageGroup,
        filmType: req.body.filmType,
        location: req.body.location,
        address: req.body.address
    })
    try{
        //Validate request
        await Game.validate(game);
        
        game.save().then(result=>{
            // console.log(result)
            res.status(201).json({
                message: "POST request to /createGame succeeded",
                createdGame: game
            });
        })
        
    }
    catch(err){
        err instanceof mongoose.Error.ValidationError;
        Object.keys(err.errors)
        
        // console.log(err)
        res.status(424).json({
            message: "POST request to /createGame failed"
        })
    }
    
});

router.delete('/games/:id', (req, res, next) => {
    Game.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
});

module.exports = router;