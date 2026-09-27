import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("health", () => {
  it("responde ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });
});
