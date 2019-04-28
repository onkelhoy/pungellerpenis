const express = require('express')
const GroupModel = require('../models/group/group') 
const UserModel = require('../models/user/user')
const ContestModel = require('../models/group/contest')

let router = express.Router()

// get all groups for a user 
router.get('/', async (req, res) => {
  try {
    let user = await UserModel.findById(req.signedCookies.credentials.id)
        .populate({path: 'groups', select: ['name', '_id']})
    return res.status(200).json(user.groups)
  }
  catch (e) {
    return res.status(500).json({error: e.message})
  }
})

// create a new group 
router.put('/', async (req, res) => {
  try {
    let group = new GroupModel()
    let user = await UserModel.findById(req.signedCookies.credentials.id)

    group.name = req.body.name 
    group.creator = user._id
    await group.save()

    user.groups.push(group)
    await user.save()

    res.status(200).json(true)
  }
  catch (e) {
    return res.status(500).json(e.message)
  }
})

// update the group 
router.post('/', async (req, res) => {
  try {
    let group = await GroupModel.findOne({ name: req.body.old })
    if (!group)
    {
      return res.status(404).json({error: 'The group does not exists'})
    } 
    if (group.creator._id.equals(req.signedCookies.credentials.id)) 
    {
      group.name = req.body.new 
      await group.save()
      return res.status(200).json(true)
    }

    res.status(403).json({error: 'permission denied, you are not the owner'})
  }
  catch (e)
  {
    res.status(500).json({error: e.message}) 
  }
})

// ban a player from the group 
router.post('/kick', async (req, res) => {
  // remove from all contests in group
  try {
    let group = await GroupModel.findOne({ name: req.body.groupname })
    if (!group)
    {
      return res.status(404).json({error: 'The group was not found'})
    }
    let user = await UserModel.findById(req.body.user)
    if (!user)
    {
      return res.status(404).json({error: 'The user was not found'})
    }

    if (group.creator._id.equals(req.signedCookies.credentials.id))
    {
      let contests = await ContestModel.find({ group: group._id })
      for (let contest of contests) 
      {
        let index = contest.scrorelist.findIndex(s => s.user._id.equals(user._id))
        if (index > -1)
        {
          contest.scrorelist.splice(index, 1)
          await contest.save()
        }
      }

      user.groups = user.groups.filter(g => !g._id.equals(group._id))
      await user.save()
      return res.status(202).json(true)
    }

    res.status(403).json({error: 'permission denied, you are not the owner'})
  }
  catch (e) {
    return res.status(500).json({error: e.message})
  }
})

router.post('/join', async (req, res) => {
  // add to all contests in group 
  try {
    let group = await GroupModel.findOne({ name: req.body.name })
    if (!group)
    {
      return res.status(404).json({error: 'The group does not exists'})
    }
    let user = await UserModel.findById(req.signedCookies.credentials.id)

    let result = user.groups.find(t => t._id.equals(group._id))
    if (result)
    {
      return res.status(403).json({error: 'You are already a member of this group'})
    }
    else 
    {
      user.groups.push(group)
      await user.save()

      return res.status(202).json(true)
    }
  }
  catch (e) {
    res.status(500).json({error:e.message})
  }
})

router.delete('/', async (req, res) => {
  try {
    let group = await GroupModel.findOne({name: req.body.name})
    if (!group)
    {
      return res.status(404).json({error: 'group not found'})
    }

    if (!group.creator._id.equals(req.signedCookies.credentials.id))
    {
      return res.status(403).json({error: 'permission denied, you are not the owner'})
    }
    
    await ContestModel.deleteMany({ group: group._id })
    await GroupModel.deleteOne({ _id: group._id })

    return res.status(202).json(true)
  }
  catch (e)
  {
    return res.status(500).json({error: e.message})
  }
})

module.exports = router 