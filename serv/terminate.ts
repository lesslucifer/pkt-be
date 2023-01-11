import GameServ from "./game.serv"

export default function terminate(server, options = { coredump: false, timeout: 500 }) {
  let exited = false
  const exit = code => {
    if (!exited) {
      exited = false
      options.coredump ? process.abort() : process.exit(code)
    }
  }

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      console.error(err)
    }
    
    if (reason === 'exit') {
      console.log('Crashed - start saving games...')
      return GameServ.save().then(() => {
        console.log('Crashed - games saved...')
        server.close(exit)
        setTimeout(exit, options.timeout).unref()
      })
    }

    server.close(exit)
    setTimeout(exit, options.timeout).unref()
  }
}
