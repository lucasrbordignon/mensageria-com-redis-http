
# Pub/Sub com Node.js, TypeScript e Redis

Este projeto demonstra a implementação de um sistema de **Pub/Sub** (Publicação/Assinatura) usando **Node.js**, **TypeScript** e **Redis**. O Redis atua como o intermediário entre o **publicador** (publisher) e o **assinante** (subscriber), permitindo a troca de mensagens de forma assíncrona.

## 📋 Pré-requisitos

Certifique-se de ter o seguinte instalado em sua máquina:

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn** (para gerenciar pacotes)
- **Redis** (rodando localmente ou em contêiner Docker)

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

Primeiro, clone o repositório para a sua máquina:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
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

Certifique-se de que o Redis esteja rodando localmente. Se você não tem o Redis instalado, siga as instruções abaixo:

#### a) Rodar Redis localmente via Docker:

```bash
docker run --name redis -d -p 6379:6379 redis
```

#### b) Ou instalar o Redis diretamente no sistema:
- **Ubuntu/Debian**:
  ```bash
  sudo apt update
  sudo apt install redis-server
  sudo systemctl start redis-server
  ```
- **MacOS (Homebrew)**:
  ```bash
  brew install redis
  brew services start redis
  ```

### 4. Executar o Assinante (Subscriber)

O assinante fica escutando o canal Redis e recebe as mensagens publicadas.

```bash
npx ts-node subscriber.ts
```

### 5. Executar o Publicador (Publisher)

O publicador envia uma mensagem para o canal Redis.

```bash
npx ts-node publisher.ts
```

### 6. Testando

- Quando o **subscriber** estiver rodando, ele ficará esperando por novas mensagens.
- Execute o **publisher** para enviar uma mensagem ao canal `notifications`.
- O **subscriber** deve receber e exibir a mensagem no console.

## 📚 Explicação do sistema Pub/Sub

- **Pub/Sub** (Publicação/Assinatura) é um padrão de mensageria onde:
  - Um **publicador** envia mensagens para um **canal**.
  - Um ou mais **assinantes** escutam esse canal e processam as mensagens que são publicadas.
  
### 📤 Publicador (Publisher)

No arquivo `publisher.ts`, temos o código responsável por publicar uma mensagem no canal Redis `notifications`:

```typescript
import { createClient } from 'redis';

async function publishMessage() {
  const redisClient = createClient();
  await redisClient.connect();

  const message = { title: 'Nova Notificação!', body: 'Você tem uma nova mensagem.', timestamp: new Date() };

  await redisClient.publish('notifications', JSON.stringify(message));
  console.log('Mensagem publicada:', message);

  await redisClient.disconnect();
}

publishMessage().catch(console.error);
```

### 📥 Assinante (Subscriber)

No arquivo `subscriber.ts`, temos o código que assina o canal `notifications` e recebe as mensagens publicadas:

```typescript
import { createClient } from 'redis';

async function subscribeToMessages() {
  const redisClient = createClient();
  await redisClient.connect();

  await redisClient.subscribe('notifications', (message) => {
    console.log('Mensagem recebida:', JSON.parse(message));
  });

  console.log('Assinado ao canal: notifications');
}

subscribeToMessages().catch(console.error);
```

### 🎯 Funcionalidade

- O **publicador** publica uma mensagem no canal `notifications`.
- O **assinante** assina o canal `notifications` e imprime as mensagens recebidas no console.

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **TypeScript**: Superset de JavaScript com tipagem estática.
- **Redis**: Banco de dados em memória utilizado para mensageria e cache.
