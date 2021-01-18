const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const mail = `${Date.now()}@mail.com`;

let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: "User Account",
    mail: `${Date.now()}@mail.com`,
    password: 12345,
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, "Chave");
});

test("Deve listar todos os usuarios", () => {
  return request(app)
    .get("/users")
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Deve inserir um usuário com sucesso", () => {
  return request(app)
    .post("/users")
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: "Leonardo Silva",
      mail,
      password: "12345",
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Leonardo Silva");
      expect(res.body).not.toHaveProperty("password");
    });
});

test("Deve armazenar senha criptografada", async () => {
  const res = await request(app)
    .post("/users")
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: "Leonardo",
      mail: `${Date.now()}@mail.com`,
      password: "12345",
    });
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe("12345");
});

test("Não deve inserir usuário sem nome", () => {
  return request(app)
    .post("/users")
    .set('authorization', `bearer ${user.token}`)
    .send({ mail: "teste@email.com", password: "12345" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Nome é um atributo obrigatório");
    });
});

test("Não deve inserir usuário sem email", async () => {
  const result = await request(app)
    .post("/users")
    .set('authorization', `bearer ${user.token}`)
    .send({ name: "Leonardo", password: "12345" });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("Email é um atributo obrigatório");
});

test("Não deve inserir usuário sem senha", (done) => {
  return request(app)
    .post("/users")
    .set('authorization', `bearer ${user.token}`)
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
    .set('authorization', `bearer ${user.token}`)
    .send({ name: "Leonardo", mail, password: "12345" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Já existe um usuário com esse e-mail");
    });
});
