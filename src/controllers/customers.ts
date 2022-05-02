import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Request, Response } from "express";

const prisma = new PrismaClient();

type Address = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  latitude?: string;
  longitude?: string;
};

/* Cria o cliente e já os endereços que estão associados a ele */
const createCustomers = async function (req: Request, res: Response) {
  try {
    const { cnpj, corporateName, telephone, nameContact } = req.body;
    let { address } = req.body;
    
    /* Busca a latitude e longitude com a API do google, se o endereço for inválido os dois campos ficam em branco */
    address = await Promise.all(
      address.map(async (element: Address) => {
        const url =
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          `${encodeURIComponent(element.number)}` +
          ",+" +
          `${encodeURIComponent(element.city)}` +
          "+" +
          `${encodeURIComponent(element.state.replaceAll(" ", ""))}` +
          "&key=AIzaSyArKgKrMBQQrDtXT1wt7wqFnXEACROeNX8";

        const res = await axios.get(url);
        if (res.data.status === "ZERO_RESULTS") {
          element.latitude = "";
          element.longitude = "";
        } else {
          element.latitude =
            res.data.results[0].geometry.location.lat.toString();
          element.longitude =
            res.data.results[0].geometry.location.lng.toString();
        }

        return element;
      })
    );

    const customer = await prisma.customers.create({
      data: {
        cnpj,
        corporateName,
        telephone,
        nameContact,
        address: {
          createMany: {
            data: address.map((element: Address) => {
              return {
                street: element.street,
                number: element.number,
                complement: element.complement,
                neighborhood: element.neighborhood,
                city: element.city,
                state: element.state,
                cep: element.cep,
                latitude: element.latitude,
                longitude: element.longitude,
              };
            }),
          },
        },
      },
    });

    res.status(200).json(customer);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
};

/* Lista todos os clientes */
const listCustomers = async function (req: Request, res: Response) {
  try {
    const result = await prisma.customers.findMany({
      include: {
        address: true,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).send({ error });
  }
};

/* Atualiza somente os dados do cliente, sem o endereço */
const updateCustomer = async function (req: Request, res: Response) {
  try {
    const customerId = parseInt(req.query.id as string);
    const { cnpj, corporateName, telephone, nameContact } = req.body;

    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
    });

    if (!customer) throw "Cliente não existe";

    const updateCustomer = await prisma.customers.update({
      where: { id: customerId },
      data: {
        cnpj,
        corporateName,
        telephone,
        nameContact,
      },
    });

    res.status(200).json(updateCustomer);
  } catch (error) {
    res.status(400).send({ error });
  }
};

/* Deleta o cliente e todos os endereços que estavam ligados a ele */
const deleteCustomer = async function (req: Request, res: Response) {
  try {
    const customerId = parseInt(req.query.id as string);

    const deleteAddress = prisma.address.deleteMany({
      where: {
        customersId: customerId,
      },
    });

    const deleteCustomer = prisma.customers.delete({
      where: {
        id: customerId,
      },
    });
    
    const transaction = await prisma.$transaction([
      deleteAddress,
      deleteCustomer,
    ]);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).send({ error });
  }
};

/* Lista um cliente especifico */
const getCustomer = async function (req: Request, res: Response) {
  try {
    const customerId = parseInt(req.query.id as string);

    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      include: {
        address: true,
      },
    });

    if (!customer) throw "Cliente não existe";

    res.status(200).json(customer);
  } catch (error) {
    console.log(error)
    res.status(400).send({ error });
  }
};

/* Atualiza um endereço especifico de um usuário selecioando */  
const updateAddress = async function (req: Request, res: Response) {
  try {
    const customerId = parseInt(req.query.customerId as string);
    const addressId = parseInt(req.query.id as string);
    
    const { street, number, complement, neighborhood, city, state, cep } =
      req.body;
    let latitude,
      longitude = "";

    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
    });
    
    if (!customer) throw "Cliente não existe";

    const url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      `${encodeURIComponent(number)}` +
      ",+" +
      `${encodeURIComponent(city)}` +
      "+" +
      `${encodeURIComponent(state.replaceAll(" ", ""))}` +
      "&key=AIzaSyArKgKrMBQQrDtXT1wt7wqFnXEACROeNX8";

    const response = await axios.get(url);

    if (response.data.status === "ZERO_RESULTS")
      throw "Informe um endereço válido";

    latitude = response.data.results[0].geometry.location.lat.toString();
    longitude = response.data.results[0].geometry.location.lng.toString();

    const address = await prisma.customers.update({
      where: { id: customerId },
      data: {
        address: {
          update: {
            where: {
              id: addressId,
            },
            data: {
              street,
              number,
              complement,
              neighborhood,
              city,
              state,
              cep,
              latitude,
              longitude,
            },
          },
        },
      },
    });

    res.status(200).json(address);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
};

export {
  createCustomers,
  listCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  updateAddress,
};
