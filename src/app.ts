import express from "express";
import { customers } from "./routes/customers";

const app = express();
app.use(express.json());
app.use(customers);

export { app };

