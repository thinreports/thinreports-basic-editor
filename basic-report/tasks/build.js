const where = require('./helper').where
const package = require('../package.json')

const packager = require('electron-packager')
const archiver = require('archiver')
const path = require('path')
const fs = require('fs')

const targetPlatforms = process.argv[2] ? [process.argv[2]] : ['darwin', 'linux', 'win32']

const config = {
  packager: {
    arch: 'x64',
    asar: true,
    dir: where.app,
    icon: path.join(where.app, 'assets/images/app-icon'),
    ignore: 'editor/',
    out: path.join(where.root, 'builds'),
    overwrite: true,
    platform: targetPlatforms
  },
  packageName: {
    'Thinreports Editor-darwin-x64': 'ThinreportsEditor-mac',
    'Thinreports Editor-linux-x64': 'ThinreportsEditor-linux',
    'Thinreports Editor-win32-x64': 'ThinreportsEditor-windows'
  }
}

clean()
build()

function clean () {
  require('del').sync(['builds/*'])
  console.log('\x1b[33m`builds` directory cleaned.\n\x1b[0m')
}

function build () {
  console.log('\x1b[34mBuilding electron app(s)...\n\x1b[0m')

  packager(config.packager)
    .then(mapPackageNameAll)
    .then(archivePackageAll)
    .then((appPaths) => {
      console.log('Build(s) successful!')
      console.log(appPaths)
    })
    .catch((error) => {
      console.error('\x1b[31mError from `electron-packager` when building app...\x1b[0m')
      console.error(error)
    })
}

function mapPackageNameAll (appPaths) {
  return Promise.all(appPaths.map(mapPackageName))
}

function archivePackageAll (appPaths) {
  return Promise.all(appPaths.map(archivePackage))
}

function mapPackageName (appPath) {
  return new Promise((resolve, reject) => {
    const originalName = path.basename(appPath)
    const mappedName = config.packageName[originalName]

    if (!mappedName) {
      reject(`No package name setting for #{originalName}`)
    }

    const mappedAppPath = path.join(path.dirname(appPath), mappedName)

    fs.rename(appPath, mappedAppPath, error => {
      if (error) {
        reject(error)
      } else {
        resolve(mappedAppPath)
      }
    })
  })
}

function archivePackage (appPath) {
  const outputPath = `${appPath}.zip`

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
    archive.directory(appPath, false)
    archive.finalize()
  })
}
