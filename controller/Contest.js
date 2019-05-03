const express = require('express')
const ContestModel  = require('../models/group/contest') 
const GroupModel = require('../models/group/group')
const ImageModel = require('../models/user/image')
const UserModel = require('../models/user/user')


let router = express.Router()

router.get('/:group', async (req, res) => {
  // get all 
  try {
    let {group, user} = await HasAccess(req, res, {name: req.params.group})
    
    if (!group)
    {
      return 
    }
    
    let contests = await ContestModel.find({group: group._id})

    res.status(200).json(contests)
  }
  catch (e) {
    res.status(500).json({error: e.message})
  }
})

router.get('/:contest/next', async (req, res) => {
  try 
  {
    // check first access 
    let {group, user, contest} = await HasAccessById(req, res, req.params.contest)

    if (!group)
    {
      return
    }

    // check if user exists in scorelist 
    let userindex = contest.scorelist.findIndex(v => v.user._id.equals(user._id))
    if (userindex === -1)
    {
      // add him 
      contest.scorelist.push({value: 0, index: 0, user})
      userindex = contest.scorelist.length - 1
      await contest.save()
    }

    let index = contest.scorelist[userindex].index 

    if (index >= contest.images.length)
    {
      return res.status(200).json({ code: 2, message: 'You already finished the contest' })
    }

    let image = await ImageModel.findById(contest.images[index]._id)
    
    if (!image)
    {
      return res.status(404).json({error: 'Image does not exists'})
    }

    res.status(200).json({code: 1, id: image._id, url: image.url})
  }
  catch (e) 
  {
    return res.status(500).json({error: e.message})
  }
})

router.post('/answer', async (req, res) => {
  try 
  {
    // check first access 
    const {group, user, contest} = await HasAccessById(req, res, req.body.contest)

    if (!group)
    {
      return
    }

    // answer the current index in list (based that he already hasnt)

    // check if user exists in scorelist 
    let userindex = contest.scorelist.findIndex(v => v.user._id.equals(user._id))
    if (userindex === -1)
    {
      return res.status(404).json({error: 'You must first ask for the next image'})
    }

    let currentUser = contest.scorelist[userindex]

    if (currentUser.index >= contest.images.length)
    {
      return res.status(200).json({ code: 2, message: 'You already finished the contest' })
    }

    let img = await ImageModel.findById(contest.images[currentUser.index])

    if (!img)
    {
      return res.status(404).json({error: 'The image was not found'})
    }

    let correct = false 
    if (/penis/i.test(req.body.answer))
    {
      if (img.type === 'penis')
      {
        correct = true 
      }
    }
    else 
    {
      if (img.type === 'pung')
      {
        correct = true 
      }
    }
    
    contest.scorelist[userindex].index++
    
    if (correct) 
    {
      contest.scorelist[userindex].value++ 
      res.status(200).json({code: 1, answer: true})
    }
    else 
    {
      res.status(200).json({code: 1, answer: false})
    }

    await contest.save()
  }
  catch (e) 
  {
    return res.status(500).json({error: e.message})
  }
})

router.put('/', async (req, res) => {
  // save
  try 
  {
    let imgcount = Number(req.body.images)
    
    let {group, user} = await HasAccess(req, res, {name: req.body.group})

    if (!group)
    {
      return
    }
    
    if (isNaN(imgcount))
    {
      return res.status(500).json({error: 'argument images must be numerical'})
    }
    let imageCollection = await ImageModel.aggregate([{'$sample': {size: imgcount}}])
    
    if (imageCollection.length === 0)
    {
      return res.status(404).json({error: 'There was not a single image to play with'})
    }
    
    let model = new ContestModel()
    model.images = imageCollection 
    model.name = req.body.name 
    model.group = group._id
    await model.save()

    if (imageCollection.length < imgcount) 
    {
      res.status(200).json({warning: `There was only ${imgcount} images to play with`})
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

router.post('/score', async (req, res) => {
  // get the final scorelist and mark it as ended - only if all has finished 
  try 
  {
    const {group, user, contest} = await HasAccessById(req, res, req.body.contest)
    if (!group)
    {
      return 
    }
  }
  catch (e)
  {
    res.status(500).json({error: e})
  }
})


async function HasAccess (req, res, query) {
  let group = await GroupModel.findOne(query)

  if (!group) {
    res.status(404).json({error: 'Group does not exists'})
    return false 
  }

  let user = await UserModel.findById(req.signedCookies.credentials.id)
  // make sure user belongs to the group 
  if (!user.groups.find(g => g._id.equals(group._id)))
  {
    res.status(403).json({error: 'Permission denied, you don\'t belong to this group'})
    return false 
  }

  return { group, user } 
}

async function HasAccessById (req, res, contestid) {
  let contest = await ContestModel.findById(contestid)

  if (!contest)
  {
    res.status(404).json({error: 'Contest does not exists'})
    return false 
  }

  let { group, user } = await HasAccess(req, res, {_id: contest.group})
  if (!group)
  {
    return false 
  }

  return {group, user, contest}
}

module.exports = router 