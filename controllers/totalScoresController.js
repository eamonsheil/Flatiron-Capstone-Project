const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const TotalScores = require('../models/totalScoresModel')
const User = require('../models/userModel')

const getTotals = asyncHandler(async (req, res) => {
    // const filter = { user: {$eq: req.params.id }};
    const totals = await TotalScores.findOne({user: {$eq: req.params.id }})
    res.json(totals)
})

const updateChordTotals = asyncHandler(async (req,res) => {
    const filter = { user: req.params.id };
    const update = {
        totalChordsAttempted: req.body.totalAttempted,
        totalChordsCorrect: req.body.totalCorrect 
    }
    const totals = await TotalScores.findOneAndUpdate(filter, update, { new: true });
    
    if (!totals) {
        console.log("creating new record")
        newTotals = await TotalScores.create({
            user: req.params.id,
            totalChordsAttempted: req.body.totalAttempted,
            totalChordsCorrect: req.body.totalCorrect
        });
        res.status(200).json(newTotals)
    }
    else {
        res.json(totals)
    }
})


const updatePitchTotals = asyncHandler(async (req,res) => {
    const filter = { user: req.params.id };
    const update = {
        totalPitchesAttempted: req.body.totalPitchesAttempted,
        totalPitchesCorrect: req.body.totalPitchesCorrect,
        currentPitchStreak: req.body.currentPitchStreak
    };
    const totals = await TotalScores.findOneAndUpdate(filter, update, { new: true });
    
    if (!totals) {
        console.log("creating new record")
        newTotals = await TotalScores.create({
            user: req.params.id,
            totalPitchesAttempted: req.body.totalPitchesAttempted,
            totalPitchesCorrect: req.body.totalPitchesCorrect,
            currentPitchStreak: req.body.currentPitchStreak
        });
        res.status(200).json(newTotals)
    }
    else {
        res.json(totals)
    }
})


module.exports = {
    updateChordTotals,
    getTotals,
    updatePitchTotals
}