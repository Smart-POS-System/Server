import { Request, Response } from "express";
import { StockService } from "../services/stockService";
import { responseEncoding } from "axios";

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  static async addNewStock(req: Request, res: Response) {
    const { item_id, quantity, location_id, manager_id } = req.body;

    try {
      await StockService.addNewStock(
        item_id,
        quantity,
        location_id,
        manager_id
      );
      res.status(200).send({ msg: "new stock added!" });
    } catch (err) {
      console.error("Error adding new stock: ", err);
      res.status(400).json({ msg: "Error adding new stock: " });
    }
  }

  static async removeStock(req: Request, res: Response) {
    const { stock_id } = req.body;

    if (!stock_id) {
      res.status(400).json({ msg: "stock id is required!" });
    }

    try {
      await StockService.removeStock(stock_id);
      res.status(200).send({ msg: "stock removed!" });
    } catch (err) {
      console.error("Error removing stock ", err);
      res.status(400).json({ msg: "Error removing stock" });
    }
  }
}
