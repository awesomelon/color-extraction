import express, { Router } from "express";
import serverless from "serverless-http";

export const app = express();
const router = Router();

app.use("/.netlify/functions/app", router);

export const handler = serverless(app);
