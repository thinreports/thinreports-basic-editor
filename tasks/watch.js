const chokidar = require('chokidar')
const execSync = require('child_process').execSync

const watcher = chokidar.watch(['app/editor', 'app/assets', 'app/locales'], {
  ignored: [
    // Ignore compiled files
    'app/assets/style.css',
    'app/**/*.soy.js'
  ],
  ignoreInitial: true
})

watcher.on('all', (event, path) => {
  console.log(event, ':', path)

  compileCss(path)
  compileJs(path)
  compileTemplate(path)
})

function compileCss (path) {
  if (/\.css$/.test(path)) {
    runTask('CSS compilation', () => execSync('npm run compile:css'))
  }
}

function compileJs (path) {
  if (/\.js$/.test(path)) {
    runTask('JavaScript compilation', () => execSync('npm run compile:javascript'))
  }
}

function compileTemplate (path) {
  if (/\.soy$/.test(path)) {
    runTask('Template compilation', () => execSync('npm run compile:template'))
  }
}

function runTask (name, task) {
  console.log(`\x1b[34m${name} processing...\x1b[0m`)
  task()
  console.log(`\x1b[33m${name} completed.\x1b[0m`)
}
