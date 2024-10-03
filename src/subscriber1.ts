// subscriber1.ts

import { createClient } from 'redis';

async function startSubscriber() {
  const redisClient = createClient()

  await redisClient.connect()

  await redisClient.subscribe('orders', (message) => {
    const { command } = JSON.parse(message)

    if (command === 'sayHello') {
      console.log('Subscriber 1: Olá, Mundo!')
    } else if (command === 'showDate') {
      console.log('Subscriber 1: A data atual é', new Date().toLocaleString())
    } else {
      console.log(`Subscriber 1: Comando desconhecido: ${command}`)
    }
  })

  console.log('Subscriber 1 escutando o canal "orders"...')
}

startSubscriber().catch(console.error)