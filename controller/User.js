const express = require('express')
const mongoose = require('mongoose')
const UserModel  = require('../models/user/user') 
const ImageModel = require('../models/user/image')

let router = express.Router()

router.post('/', async (req, res) => {
  // create session and store the player id 
  let query = UserModel.findOne({ email: req.body.email })
  try {
    let result = await query.exec() 
    if (result)
    {
      if (result.comparePassword(req.body.password))
      {
        res.cookie('credentials', { id: result._id, upload: new Date(result.upload).getTime() }, { 
          maxAge: 900000, httpOnly: true,
          signed: true, secure: true 
         })
        return res.status(200).json(true)
      }
    }

    res.status(404).json({error: 'user not found'})
  }
  catch (e) 
  {
    res.status(500).json({error: e.message})
  }
})

router.put('/', async (req, res) => {
  // create
  let user = new UserModel()
  user.email = req.body.email 
  user.password = req.body.password
  user.groups = [] 

  try 
  {
    await user.save()

    res.status(200).json(true)
  }
  catch (e)
  {
    res.status(500).json({error: e.message})
  }
})

router.post('/upload', async (req, res) => {
  let { type, url } = req.body 

  if (/penis/i.test(type))
  {
    type = ImageModel.TYPE.PENIS 
  }
  else 
  {
    type = ImageModel.TYPE.PUNG
  }

  let model = new ImageModel()
  model.url = url 
  model.type = type 

  try {
    await model.save()
    res.status(201).json(true)
  }
  catch (e) {
    res.status(500).json({error: e.message})
  }
})

router.delete('/', (req, res) => {
  // delete account 
})

module.exports = router 