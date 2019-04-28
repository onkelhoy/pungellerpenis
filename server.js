const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require('dotenv')
const cookie = require('cookie-parser')
const helmet = require('helmet')
const database = require('./util/database')
const dev = require('./util/server.dev')
const prod = require('./util/server.prod')

let cors = require("cors");

dotenv.config()

const Image = require('./models/user/image')

const app = express();
app.set('trust proxy', 1) // trust first proxy

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookie(process.env.SECRET))
app.use(helmet())

const router = require('./controller/Index')
// append /api for our http requests
app.use("/api", router);

async function init () {
  try {
    await database()

    if (process.env.MODE === 'dev') 
    {
      dev(app)
    }
    else 
    {
      prod(app)
    }
  }
  catch (e) { }
}

init()