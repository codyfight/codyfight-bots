# **Codyfight Bots**

A **TypeScript**, **Express**, and **Node.js** project that allows developers to configure and run **Codyfighters** via the [Codyfight API](https://codyfight.com/api-doc/).

---

## **Table of Contents**

1. [Features](#features)
2. [Requirements](#requirements)
3. [Project Structure](#project-structure)
4. [Setup & Configuration](#setup--configuration)
    - [Environment Variables](#environment-variables)
    - [Database Setup (SQLite / Postgres)](#database-setup-sqlite--postgres)
5. [Scripts](#scripts)
6. [Development](#development)
7. [Production](#production)
8. [Extending the Database Layer](#extending-the-database-layer)
9. [Extending Strategies](#extending-strategies)
10. [Contributing](#contributing)
11. [License](#license)

---

## **Features**
- **Configuration UI**: A user interface to add or remove bots from the database.
- **Bot Runner**: Runs configured bots that connect to the Codyfight API and perform actions in the game.
- **Bot Strategies**: Easily extend the **move** and **cast** strategies to customize bot behavior.
- **Multiple Database Support**: Uses SQLite by default; can switch to Postgres or any other DB by implementing an interface.

---

## **Requirements**
- **TypeScript**: `>= 5.0.0`
- **Express**: `^4.18.2`
- **Node.js**: `>= 23.3.0`
- **NPM**: `10.9.1` or later

---

## **Project Structure**

```
.
├── src/
│   ├── bots/
│   ├── client/
│   ├── game/
│   ├── server/
│   ├── utils/
│   └── ...
├── package.json
├── tsconfig.json
├── yarn.lock
└── ...
```

- `src/bots`: Contains core bot logic, including strategies and bot runner.
- `src/server`: Houses the Express server and database setup (SQLite or Postgres).
- `src/client`: Front-end/public assets for the configuration page.
- `src/game`: Game-specific logic and data structures (e.g., map, state, pathfinding).
- `src/utils`: Shared utility functions.

---

## **Setup & Configuration**

### **1. Environment Variables**

Create a `.env` file at the root of your project and add the necessary variables. Use the template `.env` file for reference.

```bash
# Environment
NODE_ENV=development

# SQLite (default)
DB_PATH=./src/server/db/bots.db
DB_DIALECT=sqlite
```

---

### **2. Database Setup**

#### **SQLite (Default)**
1. **Create the Database**:  
   Run the following scripts to initialize and seed an SQLite database:
   ```bash
   # Create tables
   node --loader ts-node/esm src/server/db/scripts/sqllite/create-db.ts

   # Seed database with some dummy records
   node --loader ts-node/esm src/server/db/scripts/sqllite/seed-db.ts
   ```

2. **Confirm `.env`**:  
   Make sure `.env` contains:
   ```bash
   DB_DIALECT=sqlite
   DB_PATH=./src/server/db/bots.db
   ```

#### **Postgres**
1. **Set Up Postgres**:  
   Create a Postgres database (e.g., `codyfight_bots`) and a user (e.g., `admin`).
2. **Configure `.env`**:
   ```bash
   DB_DIALECT=postgres
   DATABASE_URL=postgresql://admin@localhost:1234/codyfight_bots
   ```

---

## **Running the Bots**

There are **two ways** to run the bots:

### Running Directly with NPM (Configuration Page)
The simplest way to start and manage bots is by using npm scripts. This will launch a **configuration page** where you can add, remove, and manage bots.

#### **Start the Configuration Server**
```bash
npm run dev:server
```
- This starts an Express server locally.
- The **config page** will be available at `http://localhost:3000/`, where you can manage bots.

#### **Run All Configured Bots**
```bash
npm run dev:bot-runner
```
- This starts all bots that have been added via the config page.

---

### Running via API Requests
For more granular control, you can use the provided API. This allows you to **start, stop, and manage bots individually** through HTTP requests.

#### **Start the API Server**
```bash
npm run dev:server
```
- This launches the Express API on `http://localhost:3000`.

#### **Control Bots via API**
- You can interact with the API to create, update, delete, or start/stop individual bots.
- A **Postman collection** with full API details can be found in:
  ```
  src/server/codyfight_bots.postman_collection.json
  ```

---

### **Scripts Summary**
| Command                 | Description |
|-------------------------|------------|
| `npm run dev:server`    | Start the server with a configuration page (localhost:3000). |
| `npm run dev:bot-runner`| Start all configured bots. |
| `npm run start:server`  | Start the **compiled** server (for production). |
| `npm run start:bot-runner` | Start all bots from the compiled build. |
| `npm run build`         | Build the project for production. |


## **Development**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database**
    - For **SQLite**: Initialize the database (see [Database Setup](#database-setup)).
    - For **Postgres**: Configure `.env` and set up the database with necessary scripts.

3. **Start in Development Mode**
    - **Configuration Page**:
      ```bash
      npm run dev:config
      ```
    - **Bot Runner**:
      ```bash
      npm run dev:run-bots
      ```
---

## **Production**

1. **Build the Project**
   ```bash
   npm build
   ```

2. **Start the Compiled Server**
    - **Configuration Page**:
      ```bash
      npm run start:config
      ```
    - **Bot Runner**:
      ```bash
      npm run start:run-bots
      ```

---

## **Extending the Database Layer**

To add support for a new database type (e.g., MongoDB):
- See [`src/server/db/repository/custom-c-bot-repository.ts`](src/db/repository/custom-c-bot-repository.ts) for an example implementation of a custom database repository.

---

## **Extending Strategies**

You can extend or override the bot’s **move** and **cast** strategies by implementing custom logic:
- **Cast Strategy**: See [`src/bots/strategies/cast/custom-cast-strategy.ts`](./src/bots/strategies/cast/custom-cast-strategy.ts) for an example.
- **Move Strategy**: See [`src/bots/strategies/move/custom-move-strategy.ts`](./src/bots/strategies/move/custom-move-strategy.ts) for an example.

---

## **Contributing**

1. **Fork** this repository and **clone** your fork.
2. Create a new **branch** for your feature or fix.
3. **Commit** and **push** your changes.
4. Open a **Pull Request** against the main repository. Please include clear descriptions and, if necessary, add or update tests.


## **License**

This project is open-sourced under the [MIT License](LICENSE). Contributions are welcome!
