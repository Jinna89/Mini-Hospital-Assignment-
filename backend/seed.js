require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')
const Department = require('./models/Department')

async function main(){
  await mongoose.connect(process.env.MONGO_URI)
  await User.deleteMany({})
  await Department.deleteMany({})

  const hashed = await bcrypt.hash('password',10)
  await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed })

  await Department.insertMany([
    { name: 'Cardiology', code: 'CARD', description: 'Heart related' },
    { name: 'Orthopedics', code: 'ORTH', description: 'Bones and joints' },
  ])

  console.log('Seeded OK')
  process.exit(0)
}
main().catch(e=> { console.error(e); process.exit(1) })
