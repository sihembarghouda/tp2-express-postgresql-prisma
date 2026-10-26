
import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/categories : récupérer toutes les catégories
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

// GET /api/categories/:id : récupérer une catégorie
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

// POST /api/categories : créer une catégorie
router.post("/", async (req, res, next) => {
  try {
    const name =
      typeof req.body?.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      res.status(400).json({ error: "Le nom est obligatoire" });
      return;
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /api/categories/:id : modifier une catégorie
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name =
      typeof req.body?.name === "string" ? req.body.name.trim() : "";

    if (!Number.isInteger(id) || id <= 0 || !name) {
      res.status(400).json({
        error: "ID valide et nom obligatoire",
      });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id : supprimer une catégorie
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
