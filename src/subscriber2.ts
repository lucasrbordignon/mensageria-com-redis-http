// subscriber2.ts

import { createClient } from 'redis'

async function startSubscriber() {
  const redisClient = createClient()

  await redisClient.connect()

  await redisClient.subscribe('orders', (message) => {
    const { command } = JSON.parse(message)

    if (command === 'sayGoodbye') {
      console.log('Subscriber 2: Tchau, até mais!')
    } else if (command === 'calculate') {
      const result = 2 + 2;
      console.log('Subscriber 2: Resultado do cálculo é', result)
    } else {
      console.log(`Subscriber 2: Comando desconhecido: ${command}`)
    }
  })

  console.log('Subscriber 2 escutando o canal "orders"...')
}

startSubscriber().catch(console.error)