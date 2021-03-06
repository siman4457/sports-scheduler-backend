const express = require ('express');
const router = express.Router();
const Game = require('../models/game');
const mongoose = require('mongoose');
const Employee = require('../models/employee');

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
            message: "GET request to /getGames failed",
            error: err
        });
    }
    });
});

router.get('/getGame/:id',(req, res) => {
    Game.findById(req.params.id, function(err, game){
        if(!err){
            res.status(200).json({
                message: "GET request to getGame succeeded",
                game: game
            });
        }
        else{
            res.status(424).json({
                message: "GET request to getGame failed",
                error: err
            });
        }
    });
});

router.post('/createGame', async(req, res, next) => {
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        datetime: req.body.datetime,
        ageGroup: req.body.ageGroup,
        filmType: req.body.filmType,
        location: req.body.location,
        fieldNumber: req.body.fieldNumber,
        address: req.body.address
    });
    try{
        //Validate request
        await Game.validate(game);
        
        game.save().then(result => {
            // console.log(result)
            res.status(201).json({
                message: "POST request to /createGame succeeded",
                createdGame: game
            });
        });
        
    }
    catch(err){
        err instanceof mongoose.Error.ValidationError;
        Object.keys(err.errors);
        
        console.log("Error in /createGame", err);
        res.status(424).json({
            message: "POST request to /createGame failed",
            error: err
        });
    }
    
});

router.post('/updateGame', async (req, res) => {
    try{
        await Game.updateOne(
            {_id: req.body._id},
            { $set: {
                title: req.body.title,
                fieldNumber: req.body.fieldNumber,
                location: req.body.location,
                address: req.body.address,
                ageGroup: req.body.ageGroup,
                filmType: req.body.filmType
            }}
        );

        res.status(200).json({
            message: "Successfully updated game"
        });

    }
    catch(err){
        console.log("Error in /updateGame: ", err);
        res.status(424).json({
            message: "Error in /updateGame",
            error: err
        });
    }

});

router.delete('/deleteGame', async (req, res) => {
    try{
        
        let game = await Game.findById({"_id":req.body.id});
        let employeeId = game.employeeId;

        await Employee.updateOne(
            {_id: employeeId},
            {$pull: { games: {$in: game._id}}}
        );

        await Game.findOneAndDelete({_id: game._id});

        res.status(200).json({
            message: `Successfully deleted ${game.title}`
        });
    }
    catch(err){
        console.log("Error in /deleteGame: ", err);
        res.status(424).json({
            message: "Error in /deleteGame",
            error: err
        });
    }
});



module.exports = router;