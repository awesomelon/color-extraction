import express, { Router } from "express";
import serverless from "serverless-http";

export const server = express();
const router = Router();

server.use("/.netlify/functions/app", router);

export const handler = serverless(server);
