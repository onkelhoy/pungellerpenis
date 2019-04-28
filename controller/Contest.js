const express = require('express')
const ContestModel  = require('../models/group/contest') 
const GroupModel = require('../models/group/group')
const ImageModel = require('../models/user/image')
const UserModel = require('../models/user/user')


let router = express.Router()

router.get('/:groupid', async (req, res) => {
  // get all 
  try {
    let contests = await ContestModel.find({group: req.params.groupid})
    res.status(200).json(contests)
  }
  catch (e) {
    res.status(500).json({error: e.message})
  }
})

router.get('/:contestid/next', (req, res) => {

})

router.put('/', async (req, res) => {
  // save
  let model = new ContestModel()
  
  try 
  {
    let group = await GroupModel.findById(req.body.group)
    if (!group) {
      return res.status(404).json({error: 'Group does not exists'})
    }
    let user = await UserModel.findById(req.signedCookies.credentials.id)
    let imageCollection = await ImageModel.aggregate([{'$sample': {size: req.body.images}}])
    let warning = null

    if (imageCollection.length === 0)
    {
      return res.status(404).json({error: 'There was not a single image to play with'})
    }
    
    model.images = imageCollection 
    model.name = req.body.name 
    model.group = group._id
    await model.save()

    if (imageCollection.length < req.body.images) 
    {
      res.status(200).json({warning: `There was only ${req.body.images} images to play with`})
    }
    else 
    {
      res.status(200).json(true)
    }
  }
  catch (e)
  {
    return res.status(500).json({error: e.message})
  }
})

router.post('/', (req, res) => {
  // update
})

// router.post('/answer')

router.delete('/', async (req, res) => {
  // delete

})

module.exports = router 