import { deploy } from './deploy'

deploy()
  .then(() => {
    process.exit()
  })
  .catch(console.error)
