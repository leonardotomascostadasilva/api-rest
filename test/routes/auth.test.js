const request = require("supertest");
const app = require("../../src/app");

test("Deve criar usuário via signup", () => {
  return request(app)
    .post("/auth/signup")
    .send({
      name: "Leonardo",
      mail: `${Date.now()}@mail.com`,
      password: 12345,
    }).then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Leonardo');
      expect(res.body).toHaveProperty('mail');
      expect(res.body).not.toHaveProperty('password');
    });
});

test("Deve receber token ao logar", () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user
    .save({ name: "Leonardo", mail, password: "12345" })
    .then(() =>
      request(app).post("/auth/signin").send({ mail, password: "12345" })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
});

test("Não deve autenticar usuário com senha errada", () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user
    .save({ name: "Leonardo", mail, password: "12345" })
    .then(() =>
      request(app).post("/auth/signin").send({ mail, password: "654321" })
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Usuário ou senha inválido!");
    });
});

test("Não deve autenticar usuário com senha errada ou email errado", () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user
    .save({ name: "Leonardo", mail, password: "12345" })
    .then(() =>
      request(app)
        .post("/auth/signin")
        .send({ mail: "naoexiste", password: "12345" })
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Usuário inválido");
    });
});

test("Não deve acessar uma rota protegida sem token", () => {
  return request(app)
    .get("/v1/users")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
