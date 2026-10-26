
import "dotenv/config";
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("API - Gestion des erreurs", () => {
  it("GET /api/categories/:id retourne 404 si la catégorie n'existe pas", async () => {
    const response = await request(app).get("/api/categories/999999999");

    expect(response.status).toBe(404);
  });

  it("GET /api/products/:id retourne 404 si le produit n'existe pas", async () => {
    const response = await request(app).get("/api/products/999999999");

    expect(response.status).toBe(404);
  });

  it("POST /api/categories refuse un nom déjà existant", async () => {
    const category = await prisma.category.findFirst();

    expect(category).not.toBeNull();

    const response = await request(app)
      .post("/api/categories")
      .send({ name: category!.name });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      "Conflit : cette valeur existe déjà.",
    );
  });

 
  it("POST /api/products refuse une catégorie inexistante", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        title: "Produit avec catégorie inexistante",
        description: "",
        price: 10,
        image: "",
        categoryId: 999999999,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "La ressource demandée est introuvable.",
    );
  });
});
