import fs from "fs"
import _ from "lodash"
import fetch from "node-fetch"
import authorize from "../auth/authorize"

const client_id = process.env.GITHUB_CLIENT_ID
const client_secret = process.env.GITHUB_CLIENT_SECRET
const GITHUB_AUTH = 'https://github.com';
const GITHUB_API = 'https://api.github.com';

const config = JSON.parse(fs.readFileSync('./config.json'))
const repository = config.repository
const path = `${config.notebook_path}/${config.publish_folder}`

