import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { categorySchema } from "../validators/category.schema.js";

const router = Router();

// GET /api/categories
router.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de catégorie invalide" });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      res.status(404).json({ error: "Catégorie introuvable" });
      return;
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories
router.post("/", async (req, res, next) => {
  try {
    const validation = categorySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "Données de catégorie invalides",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const category = await prisma.category.create({
      data: validation.data,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /api/categories/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de catégorie invalide" });
      return;
    }

    const validation = categorySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "Données de catégorie invalides",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: validation.data,
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de catégorie invalide" });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;