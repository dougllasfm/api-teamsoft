import { NextFunction, Request, Response } from "express";

const insertAddress = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = [];

  if (req.body.address.length > 0) {
    req.body.address.map(
      (item: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        cep: string;
      }) => {
        if (!item.street) errors.push("Rua é obrigatória!");

        if (!item.number) errors.push("Informe o número do local!");

        if (!item.neighborhood) errors.push("Informe seu bairro!");

        if (!item.city) errors.push("Cidade obrigatória!");

        if (!item.state) errors.push("Informe o estado!");

        if (!item.cep) errors.push("CEP necessário!");
      }
    );
  }

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    return next();
  }
};

export { insertAddress };
