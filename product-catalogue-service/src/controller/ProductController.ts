import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Product } from "../entities/Product";

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.productRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return request.body.product;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { product_name, unit_weight } = request.body;

    const product = Object.assign(new Product(), {
      product_name,
      unit_weight,
    });

    return this.productRepository.save(product);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    return await this.productRepository.remove(request.body.product);
  }
}
