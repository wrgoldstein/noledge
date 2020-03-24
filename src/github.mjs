import fs from 'fs'
import tmp from 'tmp'
import util from 'util'
import { build_lookup } from './local.mjs'
import { exec } from "child_process"

const awaitExec = util.promisify(exec)
const repo = process.env.REPO
export async function clone(){
  console.log('[info] Beginning repository pull')
  await awaitExec(`rm -rf notebooks`)
  const cmd = `echo "${process.env.DEPLOY_SECRET}" > tmpssh; ` + 
  `chmod 700 tmpssh; ssh-agent bash -c 'ssh-add tmpssh; ` + 
  `git clone ${repo} notebooks'`
  await awaitExec(cmd)
  console.log('[info] Finished repository clone')
  await build_lookup()
  await awaitExec('rm tmpssh')
  console.log('[info] Cleaned up ssh credentials')
  return
}

export async function pull(){
  console.log('[info] Beginning repository pull')
  const cmd = `echo "${process.env.DEPLOY_SECRET}" > tmpssh; ` + 
  `chmod 700 tmpssh; ssh-agent bash -c 'ssh-add tmpssh; ` + 
  `git -C notebooks pull'`
  await awaitExec(cmd)
  console.log('[info] Finished repository pull')
  await build_lookup()
  await awaitExec('rm tmpssh')
  console.log('[info] Cleaned up ssh credentials')
  return
}

// hack
if (process.argv[1].split('/').pop() == 'github.mjs') {
  clone()
}
