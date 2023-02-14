const app = require("express")()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

var user = []
var socketId = []

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
  socket.on("new user", (userName) => {
    if (user.indexOf(userName) != -1) {
      socket.emit("new user", { success: false })
    } else {
      user.push(userName)
      socketId.push(socket.id)

      socket.emit("new user", { success: true })
    }
  })

  socket.on("chat message", (objeto) => {
    if (
      user.indexOf(objeto.nome) != -1 &&
      user.indexOf(objeto.nome) == socketId.indexOf(socket.id)
    ) {
      io.emit("chat message", objeto)
      // io.emit("chat message")
    } else {
      console.log("Erro: Você não tem permissão para executar a ação.")
    }
  })

  socket.on("disconnect", () => {
    let id = socketId.indexOf(socket.id)
    socketId.splice(id, 1)
    user.splice(id, 1)
    console.log(socketId)
    console.log(user)
    console.log("user Disconnected")
  })
})

http.listen(3000, () => {
  console.log("listening on *:3000")
})
