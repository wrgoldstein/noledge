const fs = require('fs')
const tmp = require('tmp')
const { exec } = require("child_process");

const repo = process.env.REPO

function clone() {
  tmp.file((err, path, fd, cleanup) => {
    fs.writeFile(path, process.env.DEPLOY_SECRET, (err)=> {
      if (err) return console.log(err)
    })
    const cmd = `ssh-agent bash -c 'ssh-add ${path}; git clone ${repo}'`
    const re = new RegExp('https:\/\/github.com\/.+\/(.+)\.git')
    const directory = re.exec(repo)[1]
    exec(`rm -rf ${directory}`)
    exec(cmd, (err, stdout, stderr) => {
      if (err) return console.log(err)
      return 'ok'
    })
  })
}

if (require.main === module) {
  clone();
}
