import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("autenticación administrativa", () => {
  it("rechaza el dashboard sin sesión", async () => {
    const response = await request(app).get("/api/admin/dashboard");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rechaza un token inválido", async () => {
    const response = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", "Bearer token-falso");
    expect(response.status).toBe(401);
  });

  it("bloquea la creación de productos sin autorización", async () => {
    const response = await request(app).post("/api/admin/products").send({
      name: "No autorizado",
    });
    expect(response.status).toBe(401);
  });

});
