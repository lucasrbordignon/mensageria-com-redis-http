
# Sistema Distribuído com Pub/Sub usando Redis, Node.js, TypeScript e Express

Este projeto implementa um sistema distribuído utilizando o padrão **Pub/Sub** (Publicação/Assinatura) com **Redis** para comunicação entre diferentes serviços. 
A aplicação usa **Node.js**, **TypeScript** e **Express** para criar uma API que envia ordens (mensagens), e diferentes **subscribers** executam comandos baseados nessas ordens.

## 📋 Pré-requisitos

Certifique-se de ter o seguinte instalado:

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn** (para gerenciar pacotes)
- **Redis** (rodando localmente ou via Docker)

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

Clone o repositório e navegue até a pasta do projeto:

```bash
git clone https://github.com/seu-usuario/mensageria-com-redis-http.git
cd seu-repositorio
```

### 2. Instalar dependências

Instale as dependências do projeto usando `npm` ou `yarn`:

```bash
npm install
# ou
yarn install
```

### 3. Configurar o Redis

Certifique-se de que o Redis esteja rodando localmente. Se necessário, você pode rodar o Redis via Docker:

```bash
docker run --name redis -d -p 6379:6379 redis
```

### 4. Executar o Publisher (Servidor Express)

O Publisher é o serviço responsável por enviar ordens via API Express.

```bash
npx ts-node src/publisher.ts
```

### 5. Executar os Subscribers

Os Subscribers escutam as ordens publicadas e executam ações baseadas nelas. Execute cada subscriber em um terminal separado:

```bash
npx ts-node src/subscriber1.ts
npx ts-node src/subscriber2.ts
```

### 6. Testar via API

Envie ordens para o sistema usando `curl` ou ferramentas como Postman. 

**Exemplo 1**: Enviar o comando `sayHello`:

```bash
curl -X POST http://localhost:3000/send-order -H "Content-Type: application/json" -d '{"command": "sayHello"}'
```

- O **Subscriber 1** responde com "Olá, Mundo!".

**Exemplo 2**: Enviar o comando `calculate`:

```bash
curl -X POST http://localhost:3000/send-order -H "Content-Type: application/json" -d '{"command": "calculate"}'
```

- O **Subscriber 2** responde com "Resultado do cálculo é 4".

## 📚 Explicação do sistema Pub/Sub

- O **Publisher** envia ordens através de um endpoint HTTP, publicando mensagens no canal Redis chamado `orders`.
- Os **Subscribers** ficam escutando esse canal e reagem às mensagens recebidas, executando ações específicas baseadas no tipo de comando.

### Arquitetura

- **Publisher (Express API)**: Responsável por enviar ordens (mensagens) via HTTP e publicar no canal Redis.
- **Subscribers**: Escutam o canal `orders` e executam comandos diferentes com base no conteúdo da mensagem.

### 📤 Exemplo de código do Publisher

```typescript
import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json());

const redisClient = createClient();
redisClient.connect().catch(console.error);

app.post('/send-order', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).send({ error: 'Comando não especificado.' });
  }

  await redisClient.publish('orders', JSON.stringify({ command }));
  console.log(`Ordem enviada: ${command}`);
  res.send({ message: 'Ordem enviada com sucesso.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Publisher rodando na porta ${PORT}`);
});
```

### 📥 Exemplo de código dos Subscribers

#### Subscriber 1 (Ações simples):

```typescript
import { createClient } from 'redis';

async function startSubscriber() {
  const redisClient = createClient();
  await redisClient.connect();

  await redisClient.subscribe('orders', (message) => {
    const { command } = JSON.parse(message);

    if (command === 'sayHello') {
      console.log('Subscriber 1: Olá, Mundo!');
    } else if (command === 'showDate') {
      console.log('Subscriber 1: A data atual é', new Date().toLocaleString());
    } else {
      console.log(`Subscriber 1: Comando desconhecido: ${command}`);
    }
  });

  console.log('Subscriber 1 escutando o canal "orders"...');
}

startSubscriber().catch(console.error);
```

#### Subscriber 2 (Cálculos):

```typescript
import { createClient } from 'redis';

async function startSubscriber() {
  const redisClient = createClient();
  await redisClient.connect();

  await redisClient.subscribe('orders', (message) => {
    const { command } = JSON.parse(message);

    if (command === 'sayGoodbye') {
      console.log('Subscriber 2: Tchau, até mais!');
    } else if (command === 'calculate') {
      const result = 2 + 2;
      console.log('Subscriber 2: Resultado do cálculo é', result);
    } else {
      console.log(`Subscriber 2: Comando desconhecido: ${command}`);
    }
  });

  console.log('Subscriber 2 escutando o canal "orders"...');
}

startSubscriber().catch(console.error);
```

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **TypeScript**: Superset de JavaScript com tipagem estática.
- **Redis**: Sistema de armazenamento de dados em memória utilizado para mensageria.

## 💼 Caso de Uso Real

Este tipo de sistema distribuído é amplamente utilizado em **arquiteturas de microserviços**, onde diferentes serviços (subsistemas) precisam reagir de forma assíncrona a eventos. Um exemplo de uso seria:

### Exemplo: Processamento de Pedidos em um Sistema de E-commerce

Imagine um sistema de e-commerce que envia ordens para diferentes serviços quando um novo pedido é criado. O serviço **Publisher** (neste caso, o serviço de pedidos) envia uma mensagem que pode conter diferentes tipos de comandos, como:

- Enviar um e-mail de confirmação para o cliente.
- Atualizar o inventário do produto.
- Criar uma fatura no sistema de contabilidade.

Cada um desses serviços seria representado por **subscribers** distintos que, ao receber uma ordem, executam uma tarefa diferente de forma assíncrona, garantindo maior escalabilidade e desacoplamento entre os sistemas.
