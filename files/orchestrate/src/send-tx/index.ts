import { sendTx } from './send-tx'

sendTx()
  .then(() => {
    process.exit()
  })
  .catch(console.error)
