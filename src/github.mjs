import fs from 'fs'
import tmp from 'tmp'
import util from 'util'
import { build_lookup } from './local.mjs'
import { exec } from "child_process"

const awaitExec = util.promisify(exec)
const repo = process.env.REPO
export async function clone(){
  try {
    console.log('[info] Beginning repository clone')
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
  } catch {
    console.log("[warn] Failed to clone repository")
  } finally {
    await awaitExec('rm -f tmpssh')
  }
}

export async function pull(){
  try {
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
  } catch {
    console.log('[warn] Failed to pull from repository')
  } finally {
    await awaitExec('rm -f tmpssh')
  }
}

// hack
if (process.argv[1].split('/').pop() == 'github.mjs') {
  clone()
}
