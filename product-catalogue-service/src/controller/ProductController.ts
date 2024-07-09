import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Product } from "../entity/Product";

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.productRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const product_id = parseInt(request.params.product_id);

    const product = await this.productRepository.findOne({
      where: { product_id },
    });

    if (!product) {
      return "Unregistered product";
    }
    return product;
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
    const product_id = parseInt(request.params.product_id);

    let productToRemove = await this.productRepository.findOneBy({
      product_id,
    });

    if (!productToRemove) {
      return "This product does not exist";
    }

    await this.productRepository.remove(productToRemove);

    return "Product has been removed";
  }
}
