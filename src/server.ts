
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import categoriesRouter from "./routes/categories.js";
import productsRouter from "./routes/products.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  }),
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Express opérationnelle",
  });
});

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);

// Gestion des erreurs non traitées par les routes
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({
      error: "Une erreur interne est survenue",
    });
  },
);

app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}`);
});
