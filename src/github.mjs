import fs from 'fs'
import tmp from 'tmp'
import util from 'util'
import { build_lookup } from './local.mjs'
import { exec } from "child_process"

const awaitExec = util.promisify(exec)
const repo = process.env.REPO

export async function clone() {
  tmp.file(async (err, path, fd, cleanup) => {
    fs.writeFile(path, process.env.DEPLOY_SECRET, (err)=> {
      if (err) return console.log(err)
    })
    const cmd = `ssh-agent bash -c 'ssh-add ${path}; git clone ${repo} notebooks'`
    await awaitExec(`rm -rf notebooks`)
    await awaitExec(cmd, (err, stdout, stderr) => {
      if (err) return console.log(err)
      return 'ok'
    })
  })
}

// hack
if (process.argv[1].split('/').pop() == 'github.mjs') {
  clone().then(build_lookup)
}
