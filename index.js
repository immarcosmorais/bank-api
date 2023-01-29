import express from "express";
import winston from "winston";
import accountRouter from "./routes/account.routes.js";
import { promises as fs } from "fs";
import cors from "cors";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";

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
  type Query{
    all: [Account]
    byId(id: Int): Account
  }
`);

app.use(express.json());
app.use(cors());
app.use("/account", accountRouter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: null,
    graphiql: true,
  })
);

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
