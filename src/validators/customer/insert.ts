import { NextFunction, Request, Response } from "express";

const insert = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errors = [];

  if (!req.body.cnpj) errors.push("Nome obrigatório!");

  if (!req.body.corporateName) errors.push("Razão social obrigatória!");

  if (!req.body.nameContact) errors.push("Nome do contato obrigatório!");

  if (!req.body.telephone) errors.push("Telefone obrigatório!");

  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    return next();
  }
};

export { insert };
