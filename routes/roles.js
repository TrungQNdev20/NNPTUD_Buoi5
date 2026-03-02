var express = require('express');
var router = express.Router();
let modelRole = require('../schemas/roles');

router.get('/', async function (req, res, next) {
    try {
        let data = await modelRole.find({ isDeleted: false });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await modelRole.findOne({ _id: id, isDeleted: false });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID not found or deleted" });
        }
    } catch (error) {
        res.status(404).send({ message: "ID not found" });
    }
});

router.post('/', async function (req, res, next) {
    try {
        let newObj = new modelRole({
            name: req.body.name,
            description: req.body.description
        });
        await newObj.save();
        res.status(201).send(newObj);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await modelRole.findOneAndUpdate(
            { _id: id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID not found or deleted" });
        }
    } catch (error) {
        res.status(404).send({ message: "ID not found" });
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await modelRole.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (result) {
            res.send({ message: "Deleted successfully", data: result });
        } else {
            res.status(404).send({ message: "ID not found or already deleted" });
        }
    } catch (error) {
        res.status(404).send({ message: "ID not found" });
    }
});

module.exports = router;
