import express from "express";
import winston from "winston";
import accountRouter from "./routes/account.routes.js";
import { promises as fs } from "fs";
import cors from "cors";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import AccountService from "./services/account.service.js";

const app = express();
const { readFile, writeFile } = fs;
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.fileName = "accounts.json";
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

const schema = buildSchema(`
  type Account {
    id: Int
    name: String
    balance: Float
  }
  input AccountInput {
    name: String
    balance: Float
  }
  type Query {
    allAccounts: [Account]
    accountById(id: Int): Account
  }
  type Mutation {
    saveAccount(account: AccountInput): Account
    removeAccount(id: Int): Boolean
    updateAccount(account: AccountInput): Account
  }
`);

const root = {
  allAccounts: () => AccountService.all(),
  accountById(args) {
    return AccountService.byId(args.id);
  },
  saveAccount({ account }) {
    return AccountService.save(account);
  },
  removeAccount(args) {
    return AccountService.remove(args);
  },
  updateAccount({ account }, args) {
    return AccountService.update(account, args);
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use(express.json());
app.use(cors());
app.use("/account", accountRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info("API Started!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(fileName, JSON.stringify(initialJson))
      .then(() => {
        logger.info("API Started!");
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
