/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../app";

describe("crud customer", () => {
  it("should be possible to create a new usere", async () => {
    const response = await request(app)
      .post("/createCustomer")
      .send({
        cnpj: "125.154.788.999",
        corporateName: "certo",
        nameContact: "douglasssssss",
        telephone: "996152628",
        address: [
          {
            street: "avenida cuiabá",
            number: "1127",
            complement: "",
            neighborhood: "setor b",
            city: "Querência",
            state: "Mato grosso",
            cep: "78643000",
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("Must update a customer's specific address", async () => {
    const res = await request(app)
      .put("/updateAddress")
      .send({
        street: "Avenida central",
        number: "540",
        complement: "Em frente a prefeitura",
        neighborhood: "Setor D",
        city: "Querência",
        state: "MT",
        cep: "78643000",
      })
      .query({ id: 1, customerId: 1 });

    expect(res.status).toBe(200);
  });

  it("get customer specific", async () => {
    const response = await request(app).get("/customer").query({ id: 1 });

    expect(response.status).toBe(200);
  });

  it("list all customers", async () => {
    const response = await request(app).get("/list");

    expect(response.status).toBe(200);
  });

  it("update customer specific", async () => {
    const response = await request(app)
      .put("/update")
      .send({
        cnpj: "125.154.788.999",
        corporateName: "certo",
        nameContact: "douglasssssss",
        telephone: "996152628",
      })
      .query({ id: 1 });

    expect(response.status).toBe(200);
  });

  it("Shouldn't be able to create a user without all the fields", async () => {
    const response = await request(app)
      .post("/createCustomer")
      .send({
        cnpj: "",
        corporateName: "certo",
        nameContact: "douglasssssss",
        telephone: "996152628",
        address: [
          {
            street: "avenida cuiabá",
            number: "1127",
            complement: "",
            neighborhood: "setor b",
            city: "Querência",
            state: "Mato grosso",
            cep: "78643000",
          },
        ],
      });

    expect(response.status).toBe(400);
  })

  it("delete customer specific", async () => {
    const response = await request(app).del("/remove").query({ id: 1 });

    expect(response.status).toBe(200);
  });
});
