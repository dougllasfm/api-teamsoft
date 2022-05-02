import { NextFunction, Request, Response } from "express";

const updateAddressValidator = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors: string[] = [];

  if (!req.body.street) errors.push("Rua é obrigatória!");

  if (!req.body.number) errors.push("Informe o número do local!");

  if (!req.body.neighborhood) errors.push("Informe seu bairro!");

  if (!req.body.city) errors.push("Cidade obrigatória!");

  if (!req.body.state) errors.push("Informe o estado!");

  if (!req.body.cep) errors.push("CEP necessário!");

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    return next();
  }
};

export { updateAddressValidator };
