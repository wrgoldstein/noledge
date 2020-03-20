import fs from 'fs'
import tmp from 'tmp'
import util from 'util'
import { build_lookup } from './local.mjs'
import { exec } from "child_process"

const awaitExec = util.promisify(exec)
const repo = process.env.REPO

export async function clone() {
  console.log('[info] Beginning cloning repository')
  tmp.file(async (err, path, fd, cleanup) => {
    fs.writeFileSync(path, process.env.DEPLOY_SECRET, (err)=> {
      if (err) return console.log(err)
    })
    const cmd = `ssh-agent bash -c 'ssh-add ${path}; git clone ${repo} notebooks'`
    await awaitExec(`rm -rf notebooks`)
    await awaitExec(cmd, async (err, stdout, stderr) => {
      if (err) return console.log(err)
      console.log('[info] Finished cloning repository')
      await build_lookup()
      return 'ok'
    })
  })
}

// hack
if (process.argv[1].split('/').pop() == 'github.mjs') {
  clone()
}
