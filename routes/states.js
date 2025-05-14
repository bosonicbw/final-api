// Packages and needed files...
const express = require('express');
const router = express.Router();
const State = require('../models/State');
const states = require('../models/statesData.json');
const verifyState = require('../middleware/verifyState');

// Handle JSON and MongoDB
const mergeFunFacts = async () => {
    const dbStates = await State.find();
    return states.map(state => {
    const match = dbStates.find(s => s.stateCode === state.code);
    return match ? { ...state, funfacts: match.funfacts } : state;
  });
};

// GET /states/
router.get('/', async (req, res) => {
    const { contig } = req.query;
    let data = await mergeFunFacts();

    if (contig === 'true') {
        data = data.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        data = data.filter(state => state.code === 'AK' || state.code === 'HI');
    }

     res.json(data);
});

// GET /states/:state
router.get('/:state', verifyState, async (req, res) => {
    const code = req.code;
    const stateData = states.find(state => state.code === code);
    const dbData = await State.findOne({ stateCode: code });

    if (dbData?.funfacts?.length) {
        stateData.funfacts = dbData.funfacts;
    }

    res.json(stateData);
});

// GET /states/:state/funfact
router.get('/:state/funfact', verifyState, async (req, res) => {
    const code = req.code;
    const dbData = await State.findOne({ stateCode: code });

    const stateData = states.find(state => state.code === code);
    const fullStateName = stateData?.state || code;

    if (!dbData || !dbData.funfacts || dbData.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${fullStateName}` });
    }

    const random = dbData.funfacts[Math.floor(Math.random() * dbData.funfacts.length)];
    res.json({ funfact: random });
});

// GET /states/:state/capital
router.get('/:state/capital', verifyState, (req, res) => {
    const code = req.code;
    const stateData = states.find(state => state.code === code);
    res.json({ state: stateData.state, capital: stateData.capital_city });
});

// GET /states/:state/nickname
router.get('/:state/nickname', verifyState, (req, res) => {
    const code = req.code;
    const stateData = states.find(state => state.code === code);
    res.json({ state: stateData.state, nickname: stateData.nickname });
});

// GET /states/:state/population
router.get('/:state/population', verifyState, (req, res) => {
    const code = req.code;
    const stateData = states.find(state => state.code === code);
    res.json({
        state: stateData.state,
        population: Number(stateData.population).toLocaleString()
    });
});

// GET /states/:state/admission
router.get('/:state/admission', verifyState, (req, res) => {
    const code = req.code;
    const stateData = states.find(state => state.code === code);
    res.json({ state: stateData.state, admitted: stateData.admission_date });
});

// POST /states/:state/funfact
router.post('/:state/funfact', verifyState, async (req, res) => {
    const code = req.code;
    const { funfacts } = req.body;
    // Error handling...
    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
        if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }


    let stateDoc = await State.findOne({ stateCode: code });

    // Confirm present before continuing
    if (stateDoc) {
        stateDoc.funfacts.push(...funfacts);
        await stateDoc.save();
        return res.json(stateDoc);
    }

    const newState = await State.create({ stateCode: code, funfacts });
    res.status(201).json(newState);
});

// PATCH /states/:state/funfact
router.patch('/:state/funfact', verifyState, async (req, res) => {
    // Instantiate vars
    const code = req.code;
    const { index, funfact } = req.body;
    const stateData = states.find(state => state.code === code);
    const fullStateName = stateData?.state || code;

    // Error handling...
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    const stateDoc = await State.findOne({ stateCode: code });

    /* Commenting out since splitting it to break it up for different messages needed...
    if (!stateDoc || !stateDoc.funfacts || index < 1 || index > stateDoc.funfacts.length) {
        return res.status(404).json({ message: `No Fun Facts found for ${fullStateName}` });
    }*/

   // General check
    if (!stateDoc || !stateDoc.funfacts) {
        return res.status(404).json({ message: `No Fun Facts found for ${fullStateName}` });
    }
    // Specific index check
    if (index < 1 || index > stateDoc.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${fullStateName}` });
    }


    // Update fun fact...
    stateDoc.funfacts[index - 1] = funfact;
    await stateDoc.save();
    res.json(stateDoc);
});

// DELETE /states/:state/funfact
router.delete('/:state/funfact', verifyState, async (req, res) => {
    // Instantiate vars
    const code = req.code;
    const { index } = req.body;
    const stateData = states.find(state => state.code === code);
    const fullStateName = stateData?.state || code;

    // Error handling...
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    const stateDoc = await State.findOne({ stateCode: code });

    /* Commenting out since splitting it to break it up for different messages needed...
    if (!stateDoc || !stateDoc.funfacts || index < 1 || index > stateDoc.funfacts.length) {
        return res.status(404).json({ message: `No Fun Facts found for ${fullStateName}` });
    }*/
   
   // General check
    if (!stateDoc || !stateDoc.funfacts) {
        return res.status(404).json({ message: `No Fun Facts found for ${fullStateName}` });
    }
    // Specific index check
    if (index < 1 || index > stateDoc.funfacts.length) {
        return res.status(404).json({ message: `No Fun Fact found at that index for ${fullStateName}` });
    }

    // Update fun fact...
    stateDoc.funfacts.splice(index - 1, 1);
    await stateDoc.save();
    res.json(stateDoc);
});

// Export for server.js...
module.exports = router;