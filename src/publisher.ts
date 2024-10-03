// publisher.ts

import express, { Request, Response } from "express"
import { createClient } from "redis"

const app = express()
app.use(express.json())

const redisClient = createClient()

redisClient.connect().catch(console.error)

// Endpoint para enviar uma ordem
app.post('/', async (Req:Request, Res:Response) => {
  const { command } = Req.body

  if (!command) {
    Res.status(400).send({ error: 'Comando não especificado' })
    return
  }

  // Publica o comando no canal 'orders'
  await redisClient.publish('orders', JSON.stringify({ command }))

  console.log(`Ordem enviada: ${command}`)
  Res.send({ message: 'Ordem enviada com sucesso.' })
})

// Inicializa o servidor Express
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Publisher rodando na porta ${PORT}`);
});