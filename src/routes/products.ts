import { Router } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { productSchema } from "../validators/product.schema.js";

const router = Router();

// GET /api/products : rechercher et lister les produits avec pagination
router.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        error: "page doit être positif et limit doit être compris entre 1 et 100",
      });
      return;
    }

    const where: Prisma.ProductWhereInput = search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { id: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
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

// POST /api/products
router.post("/", async (req, res, next) => {
  try {
    const validation = productSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "Données du produit invalides",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const { title, description, price, image, categoryId } = validation.data;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: new Prisma.Decimal(price),
        image,
        category: { connect: { id: categoryId } },
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "ID de produit invalide" });
      return;
    }

    const validation = productSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "Données du produit invalides",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const { title, description, price, image, categoryId } = validation.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: new Prisma.Decimal(price),
        image,
        category: { connect: { id: categoryId } },
      },
      include: { category: true },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id
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