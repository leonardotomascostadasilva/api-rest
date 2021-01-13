const request = require("supertest");

const app = require("../../src/app");

test("Deve listar todos os usuarios", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Deve inserir um usuário com sucesso", () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app)
    .post("/users")
    .send({
      name: "Leonardo Silva",
      mail,
      password: "12345"
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Leonardo Silva");
    });
});
