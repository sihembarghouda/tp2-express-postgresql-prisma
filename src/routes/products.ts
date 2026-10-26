
import { Router } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/products : récupérer tous les produits
router.get("/", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id : récupérer un produit
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de produit invalide" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      res.status(404).json({ error: "Produit introuvable" });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products : créer un produit
router.post("/", async (req, res, next) => {
  try {
    const { title, description, price, image, categoryId } = req.body ?? {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      res.status(400).json({
        error: "title, price et categoryId sont obligatoires et doivent être valides",
      });
      return;
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: typeof description === "string" ? description : "",
        price: new Prisma.Decimal(price),
        image: typeof image === "string" ? image : "",
        category: { connect: { id: categoryId } },
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id : modifier un produit
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, price, image, categoryId } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de produit invalide" });
      return;
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      res.status(400).json({
        error: "title, price et categoryId sont obligatoires et doivent être valides",
      });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: title.trim(),
        description: typeof description === "string" ? description : "",
        price: new Prisma.Decimal(price),
        image: typeof image === "string" ? image : "",
        category: { connect: { id: categoryId } },
      },
      include: { category: true },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id : supprimer un produit
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de produit invalide" });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
