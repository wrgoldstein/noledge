import fs from 'fs'
import tmp from 'tmp'
import util from 'util'
import { build_lookup } from './local.mjs'
import { exec } from "child_process"
const awaitExec = util.promisify(exec)

const GIT_SSH_COMMAND = "GIT_SSH_COMMAND='ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'"

export async function clone(){
  try {
    if (fs.existsSync('nbtemp')) return
    console.log('[info] Beginning repository clone')
    const cmd = `echo "${process.env.DEPLOY_SECRET}" > tmpssh; ` + 
    `chmod 700 tmpssh; ${GIT_SSH_COMMAND} ssh-agent bash -c 'ssh-add tmpssh; ` + 
    `git clone ${process.env.REPO} nbtemp'`
    await awaitExec(cmd)
    console.log('[info] Finished repository clone')
    await awaitExec(`mv nbtemp notebooks`)
    await build_lookup()
    await awaitExec('rm tmpssh')
    console.log('[info] Cleaned up ssh credentials')
    return
  } catch (e){
    console.log(e)
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
    `${GIT_SSH_COMMAND} git -C notebooks fetch'`
    await awaitExec(cmd)
    console.log('[info] Finished repository pull')
    await awaitExec(`${GIT_SSH_COMMAND} git -C notebooks reset --hard origin/master`)
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
