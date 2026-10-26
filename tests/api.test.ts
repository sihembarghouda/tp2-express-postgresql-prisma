
import "dotenv/config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API - Vérification générale", () => {
  it("GET /api/health doit retourner 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("API Express opérationnelle");
  });

  it("GET /api/categories doit retourner une liste", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("GET /api/products doit retourner les produits et la pagination", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(10);
  });

  it("GET /api/products doit accepter une recherche", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({ search: "casque" });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination).toBeDefined();

    for (const product of response.body.data) {
      expect(product.title.toLowerCase()).toContain("casque");
    }
  });

  it("GET /api/products doit accepter une pagination personnalisée", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({ page: 1, limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeLessThanOrEqual(2);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(2);
  });

  it("GET /api/products doit refuser une limite supérieure à 100", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({ limit: 101 });

    expect(response.status).toBe(400);
  });

  it("GET /api/categories/:id doit refuser un identifiant invalide", async () => {
    const response = await request(app).get("/api/categories/abc");

    expect(response.status).toBe(400);
  });

  it("GET /api/products/:id doit refuser un identifiant invalide", async () => {
    const response = await request(app).get("/api/products/abc");

    expect(response.status).toBe(400);
  });
});
