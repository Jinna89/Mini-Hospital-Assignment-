const express = require('express')
const router = express.Router()
const Patient = require('../models/Patient')
const auth = require('../middleware/auth')

router.get('/', auth, async (req,res)=>{
  const list = await Patient.find()
  res.json(list)
})

router.post('/', auth, async (req,res)=>{
  const p = await Patient.create(req.body)
  res.json(p)
})

module.exports = router
