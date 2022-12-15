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
      GameServ.save()
    }

    server.close(exit)
    setTimeout(exit, options.timeout).unref()
  }
}
