const express = require ('express');
const router = express.Router();
const Game = require('../models/game');
const Employee = require('../models/employee');

router.get('/autoAssign', async (req, res, next) => {
    try{
        const games = await Game.find({});
        const employees = await Employee.find({first_name: "Siman"});
        
        
    }catch(err){
        console.log(err);
    }


});

router.post('/assignGame', async (req, res, next) => {
    const game = req.body.game;
    const employee = req.body.employee;
    
    //Check if employee is available the same day as the game

    //Check if the employee is able to film that type of game

    //Check if the employee will be able to make it to the game on time

});

async function getGames(gameIds){
    try{
        let games = await Game.find({'_id': {$in: gameIds}});
        return games;
    }
    catch(err){
        console.log("Error in getGames: ", err);
    }
}

function isAvailableOnDay(employee, start){
    let availabilityDates = employee.availability.map(x => (
        x.toDateString()
    ));
    const newGameStartDate = new Date(start).toDateString();
    return availabilityDates.includes(newGameStartDate);
}

function isOverlapping(dateRanges){
    let sortedRanges = dateRanges.sort((prev, cur) => {
        
        let prev_end = prev.end.getTime();
        let cur_start = cur.start.getTime();
        
        if(prev_end < cur_start){
            return -1;
        }

        if(prev_end === cur_start){
            return 0;
        }

        if(prev_end > cur_start){
            return 1;
        }
    });

    for(let i=1; i < sortedRanges.length; i++){
        let prev = sortedRanges[i-1].end.getTime();
        let cur = sortedRanges[i].start.getTime();
        let overlap = (prev >= cur);

        if(overlap){
            console.log("Overlapping!");
            return true;
        }
    }
    return false;
}

async function isAvailableAtTime(employee, start, end){
    let available = true;

    await getGames(employee.games)
    .then(res =>{
        res.forEach(game => {
            // console.log(game.title + " starts at " + game.datetime)
            let cur_game_start = new Date(game.datetime);
            let cur_game_end = new Date(game.datetime);
            cur_game_end.setHours( cur_game_end.getHours() + 2 ); //TODO: CHANGE THIS TO GET THE ACTUAL END TIME. CURRENTLY JUST ADDING 2 HOURS
            
            let new_game_start = new Date(start);
            let new_game_end = new Date(end);
            new_game_end.setHours( new_game_end.getHours() + 2 ); //TODO: CHANGE THIS TO GET THE ACTUAL END TIME. CURRENTLY JUST ADDING 2 HOURS
            
            let cur_game_times = {
                start: cur_game_start,
                end: cur_game_end
            };
            let new_game_times = {
                start: new_game_start,
                end: new_game_end
            };
            
            let dateRanges = [cur_game_times, new_game_times];

            if(isOverlapping(dateRanges)){
                available = false;
            }

        });
    })
    .catch(err =>{
        console.error("Error in isAvailableAtTime: ", err);
    });

    return available;
}

async function isAvailable(employee, start, end){

    let day = isAvailableOnDay(employee, start);
    let time = await isAvailableAtTime(employee, start, end);
    console.log({day, time});

    if( day && time){
        // If the employee is available on the given day, check to see if the new game's location 
        // is different from the employee's current location. Then use Google Maps API to 
        // determine if the employee has time to drive there and get set up.
        return true;
    }
    else{        
        return false;
    }
}



router.get('/findAvailableEmployees', async(req, res) => {
    const availableEmployees = [];
    const start = req.body.start;
    const end = req.body.end;
    try{
        await Employee.find({}, function(err, employees){
            employees.forEach(employee => {
                // if(isAvailable(employee, start, end)){
                    
                //     //TODO: Check if game has already been assigned for the given time slot.
                //     // Also check if employee has enough time to set up or travel to the given location
                //     // if the location is not the same

                //     // employee.games.forEach(game => {
                //     //     console.log('game datetime: ', game.datetime)
                //     // })
                //     console.log("pushing ", employee['first_name']);
                //     availableEmployees.push(employee);
                // }
                isAvailable(employee, start, end)
                .then(res => {
                    // console.log({res});
                    if(res === true){
                        console.log("pushing ", employee['first_name']);
                        availableEmployees.push(employee);
                    }
                })
                .catch(err => {
                    console.log("Error in isAvailable: ", err);
                });
            });
        });

        if(availableEmployees.length < 1){
            console.log("No available employees");
            let none = {
                _id: 0,
                first_name: "None"
            };
            availableEmployees.push(none);
        } 

        console.log("Function fired.");
        res.status(200).json({
            message: "Request to /findAvailableEmployees was successful.",
            availableEmployees: availableEmployees
        });

    }
    catch(error){
        console.log("Error in /findAvailableEmployees", error);
        res.status(424).json({
            message: "Request to /findAvailableEmployees failed.",
            err: error
        });
    }
    
});

router.post('/scheduleGame', async(req, res) => {
    try{
        const gameId = req.body.gameId;
        const employeeId = req.body.employeeId;

        let game = await Game.findById({_id: gameId});
        
        //Case where game has no employee assigned to it
        if(!("employeeId" in game) || game.employeeId === undefined){
            game.employeeId = employeeId;
            await Employee.updateOne({_id:employeeId}, { $addToSet: { games: gameId } });
            await game.save()
            .then(
                res.status(200).json({
                    message: "Request to /scheduleGame succeeded."
                })
            );
        }
        
        //Case where we are reassigning to a new employee
        else if(game.employeeId && (String(game.employeeId) !== employeeId)){
            const oldEmployeeId = game.employeeId;
            await Employee.updateOne({_id:oldEmployeeId}, { $pull: { games: gameId } });
            game.employeeId = employeeId; //Remove old employee from game
            await Employee.updateOne({_id:employeeId}, { $addToSet: { games: gameId } });
            await game.save()
            .then(
                res.status(200).json({
                    message: "Request to /scheduleGame succeeded."
                })
            );
        }
        
        else if(game.employeeId && (String(game.employeeId) == employeeId)){
            res.status(200).json({
                message: "No changes were made."
            });
        }

        else{
            res.status(400).json({
                message: "Unknown condition in /scheduleGame."
            });
        }
    }
    catch(err){
        console.log(err);
        if(err){
            res.status(424).json({
                    message: "Request to /scheduleGame failed.",
                    err: err
            });}
    }

});


module.exports = router;