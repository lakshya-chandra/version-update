// LOGGER: MAIN

import log from 'electron-log'

log.initialize({ preload: true })

const isProd = process.env.NODE_ENV === 'production'

log.transports.console.level = false
log.transports.file.level = isProd ? 'warn' : 'debug'
log.transports.file.fileName = isProd ? 'autographa-smart.log' : 'dev.autographa-smart.log'
log.transports.file.maxSize = 15 * 1024 * 1024 // 15 MB
// log.transports.console.format = "{y}-{m}-{d} {h}:{i}:{s} [{level}] {text}";

const error = (filename, text ) => {
  log.error(`${filename}: ${text}`)
}

const warn = (filename, text) => {
  log.warn(`${filename}: ${text}`)
}

const info = (filename, text) => {
  log.info(`${filename}: ${text}`)
}

const debug = (filename, text) => {
  log.debug(`${filename}: ${text}`)
}

const logger = { error, warn, info, debug }

export default logger

export { log }
