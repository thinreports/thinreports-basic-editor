const where = require('./helper').where
const package = require('../package.json')

const packager = require('electron-packager')
const archiver = require('archiver')
const path = require('path')
const fs = require('fs')

const config = {
  arch: 'x64',
  asar: true,
  dir: where.app,
  icon: path.join(where.app, 'assets/images/app-icon'),
  ignore: 'editor/',
  out: path.join(where.root, 'builds'),
  overwrite: true,
  platform: ['darwin', 'linux', 'win32']
}

clean()
build()

function clean () {
  require('del').sync(['builds/*'])
  console.log('\x1b[33m`builds` directory cleaned.\n\x1b[0m')
}

function build () {
  console.log('\x1b[34mBuilding electron app(s)...\n\x1b[0m')

  packager(config)
    .then(archiveAll)
    .then((appPaths) => {
      console.log('Build(s) successful!')
      console.log(appPaths)
    })
    .catch((error) => {
      console.error('\x1b[31mError from `electron-packager` when building app...\x1b[0m')
      console.error(error)
    })
}

function archiveAll (appPaths) {
  return Promise.all(appPaths.map(archive))
}

function archive (path) {
  const outputPath = `${path}.zip`

  return new Promise((resolve, reject) => {
    const archive = archiver.create('zip', {})
    const output = fs.createWriteStream(outputPath)

    output.on('close', () => {
      resolve(outputPath)
    })

    archive.on('error', (error) => {
      reject(error)
    })

    archive.on('warning', (error) => {
      reject(error)
    })

    archive.pipe(output)
    archive.directory(path, false)
    archive.finalize()
  })
}
