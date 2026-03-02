var express = require('express');
var router = express.Router();
let modelUser = require('../schemas/users');

router.get('/', async function (req, res, next) {
  try {
    let data = await modelUser.find({ isDeleted: false }).populate('role');
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await modelUser.findOne({ _id: id, isDeleted: false }).populate('role');
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
    let newObj = new modelUser({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      role: req.body.role,
      status: req.body.status
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
    let result = await modelUser.findOneAndUpdate(
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
    let result = await modelUser.findOneAndUpdate(
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

// 2) Post /enable
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let result = await modelUser.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (result) {
      res.send({ message: "Enabled successfully", data: result });
    } else {
      res.status(404).send({ message: "User not found or credentials incorrect" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 3) Post /disable
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let result = await modelUser.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (result) {
      res.send({ message: "Disabled successfully", data: result });
    } else {
      res.status(404).send({ message: "User not found or credentials incorrect" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
