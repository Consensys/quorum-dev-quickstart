// tslint:disable: no-console

import { start } from './app'

start()
  .then(() => {
    process.exit()
  })
  .catch(console.log)
