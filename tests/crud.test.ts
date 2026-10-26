
import "dotenv/config";
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const suffix = `test-${Date.now()}`;
const categoryName = `Categorie ${suffix}`;
const updatedCategoryName = `Categorie modifiee ${suffix}`;
const productTitle = `Produit ${suffix}`;
const updatedProductTitle = `Produit modifie ${suffix}`;

let categoryId: number | undefined;
let productId: number | undefined;

afterAll(async () => {
  try {
    // Supprimer uniquement les données créées par ce test.
    if (productId !== undefined) {
      await prisma.product.deleteMany({
        where: { id: productId },
      });
    }

    if (categoryId !== undefined) {
      await prisma.category.deleteMany({
        where: { id: categoryId },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

describe("API - CRUD des catégories et des produits", () => {
  it("POST /api/categories crée une catégorie", async () => {
    const response = await request(app)
      .post("/api/categories")
      .send({ name: categoryName });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(categoryName);
    expect(typeof response.body.id).toBe("number");

    categoryId = response.body.id;
  });

  it("POST /api/categories refuse un nom vide", async () => {
    const response = await request(app)
      .post("/api/categories")
      .send({ name: "   " });

    expect(response.status).toBe(400);
  });

  it("GET /api/categories/:id récupère la catégorie créée", async () => {
    expect(categoryId).toBeDefined();

    const response = await request(app).get(
      `/api/categories/${categoryId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(categoryId);
    expect(response.body.name).toBe(categoryName);
  });

  it("PUT /api/categories/:id modifie la catégorie", async () => {
    expect(categoryId).toBeDefined();

    const response = await request(app)
      .put(`/api/categories/${categoryId}`)
      .send({ name: updatedCategoryName });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedCategoryName);
  });

  it("POST /api/products crée un produit", async () => {
    expect(categoryId).toBeDefined();

    const response = await request(app)
      .post("/api/products")
      .send({
        title: productTitle,
        description: "Produit temporaire pour les tests",
        price: 12.5,
        image: "",
        categoryId,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(productTitle);
    expect(response.body.categoryId).toBe(categoryId);

    productId = response.body.id;
  });

  it("POST /api/products refuse un prix invalide", async () => {
    expect(categoryId).toBeDefined();

    const response = await request(app)
      .post("/api/products")
      .send({
        title: `Produit invalide ${suffix}`,
        price: -5,
        categoryId,
      });

    expect(response.status).toBe(400);
  });

  it("GET /api/products/:id récupère le produit créé", async () => {
    expect(productId).toBeDefined();

    const response = await request(app).get(
      `/api/products/${productId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.title).toBe(productTitle);
  });

  it("PUT /api/products/:id modifie le produit", async () => {
    expect(productId).toBeDefined();
    expect(categoryId).toBeDefined();

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .send({
        title: updatedProductTitle,
        description: "Description modifiée",
        price: 15,
        image: "",
        categoryId,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedProductTitle);
  });

  it("DELETE /api/products/:id supprime le produit", async () => {
    expect(productId).toBeDefined();

    const response = await request(app).delete(
      `/api/products/${productId}`,
    );

    expect(response.status).toBe(204);

    // Éviter de supprimer à nouveau le produit dans le nettoyage.
    productId = undefined;
  });

  it("DELETE /api/categories/:id supprime la catégorie temporaire", async () => {
    expect(categoryId).toBeDefined();

    const response = await request(app).delete(
      `/api/categories/${categoryId}`,
    );

    expect(response.status).toBe(204);

    categoryId = undefined;
  });
});
