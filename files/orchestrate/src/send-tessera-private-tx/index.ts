import { start } from './app'

start()
  .then(() => {
    process.exit()
  })
  .catch(console.error);
