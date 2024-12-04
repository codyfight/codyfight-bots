# Codyfight Bots

A **TypeScript**, **Express**, and **Node.js** project that allows developers to configure and run Codyfighters via
the [Codyfight API](https://codyfight.com/api-doc/).

## Requirements

- **TypeScript**: `>=5.0.0`
- **Express**: `^4.18.2`
- **Node.js**: `>=18.0.0`
- **Yarn**: `3.6.4` or later

## Usage

### 1. Configure the `.env` file

Create a `.env` file in the root directory and add the following configuration:

```
PORT={server-port}
NODE_ENV={environment}
GAME_URL={game-server-url}
CKEY={your-cagent-secret-key}
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Start in development mode

```bash
yarn dev
```

### 4. Build the project for production

```bash
yarn build
```

### 5. Start the compiled project

```bash
yarn start
```
