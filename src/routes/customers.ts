import express from "express";
import { createCustomers, deleteCustomer, getCustomer, listCustomers, updateAddress, updateCustomer } from "../controllers/customers";
import { updateAddressValidator } from "../validators/address/update";
import { insert } from "../validators/customer/insert";

const customers = express.Router();

customers.post("/createCustomer", insert, createCustomers);

customers.get("/list", listCustomers);

customers.get("/customer", getCustomer);

customers.put("/update",  insert, updateCustomer);

customers.put("/updateAddress", updateAddressValidator, updateAddress);

customers.delete("/remove", deleteCustomer);


export { customers };
