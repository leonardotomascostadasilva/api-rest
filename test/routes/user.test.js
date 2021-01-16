const request = require("supertest");

const app = require("../../src/app");

const mail = `${Date.now()}@mail.com`;

test("Deve listar todos os usuarios", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Deve inserir um usuário com sucesso", () => {
  return request(app)
    .post("/users")
    .send({
      name: "Leonardo Silva",
      mail,
      password: "12345",
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Leonardo Silva");
    });
});

test("Não deve inserir usuário sem nome", () => {
  return request(app)
    .post("/users")
    .send({ mail: "teste@email.com", password: "12345" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Nome é um atributo obrigatório");
    });
});

test("Não deve inserir usuário sem email", async () => {
  const result = await request(app)
    .post("/users")
    .send({ name: "Leonardo", password: "12345" });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("Email é um atributo obrigatório");
});

test("Não deve inserir usuário sem senha", (done) => {
  return request(app)
    .post("/users")
    .send({ name: "Leonardo", mail: "teste@email.com" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Senha é um atributo obrigatório");
      done();
    })
    .catch((err) => done.fail(err));
});

test("Não deve inserir usuário com email existente", () => {
  return request(app)
    .post("/users")
    .send({ name: "Leonardo", mail, password: "12345" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Já existe um usuário com esse e-mail");
    });
});
