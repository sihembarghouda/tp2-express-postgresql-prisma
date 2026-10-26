
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import categoriesRouter from "./routes/categories.js";
import productsRouter from "./routes/products.js";

const app = express();

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

// Gestion centralisée des erreurs
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Erreur API :", error);

    const prismaError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string";

    if (prismaError) {
      const code = error.code;

      if (code === "P2002") {
        return res.status(409).json({
          error: "Conflit : cette valeur existe déjà.",
        });
      }

      if (code === "P2025") {
        return res.status(404).json({
          error: "La ressource demandée est introuvable.",
        });
      }

      if (code === "P2003") {
        return res.status(409).json({
          error:
            "Opération impossible : une ressource liée est invalide ou utilisée.",
        });
      }
    }

    if (
      error instanceof SyntaxError &&
      "status" in error &&
      error.status === 400
    ) {
      return res.status(400).json({
        error: "Le format JSON envoyé est invalide.",
      });
    }

    return res.status(500).json({
      error: "Une erreur interne est survenue.",
    });
  },
);

export default app;
