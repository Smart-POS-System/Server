import { Request, Response } from "express";
import { StockService } from "../services/stockService";

export class StockController {
  static async getStocks(req: Request, res: Response) {
    const { regionId, locationId } = req.query;
    const location_id = parseInt(locationId as string, 10);
    const region_id = parseInt(regionId as string, 10);

    try {
      let stocks;
      if (locationId) {
        stocks = await StockService.getStocksByLocation(location_id);
      } else if (regionId) {
        stocks = await StockService.getStocksByRegion(region_id);
      } else {
        return res
          .status(400)
          .json({ error: "Please provide either locationId or regionId" });
      }

      return res.status(200).json(stocks);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error featching data from database." });
    }
  }

  static async getExpires(req: Request, res: Response) {
    const { type } = req.query;
    const { location_id } = req.body;

    try {
      let expires;

      if (type === "expired") {
        expires = await StockService.getExpired(location_id);
      } else if (type === "expiring") {
        expires = await StockService.getExpiring(location_id);
      } else {
        return res
          .status(400)
          .json({ msg: "Mention the type: expiring or expired." });
      }
      res.status(200).json(expires);
    } catch (error) {
      console.error("Error fetching expiration data:", error);
      return res.status(500).json({ msg: "Error fetching expiration data." });
    }
  }

  static async addStock(req: Request, res: Response) {
    const { item_id, quantity, location_id, manager_id } = req.body;

    if (!item_id || !quantity || !location_id || !manager_id) {
      return res.status(400).json({
        msg: "All fields are required: item_id, quantity, location_id, manager_id.",
      });
    }

    try {
      await StockService.addStock(item_id, quantity, location_id, manager_id);

      res.status(200).send({ msg: "new stock added!" });
    } catch (error) {
      console.error("Error adding new stock: ", error);
      res.status(500).json({ msg: "Error adding new stock: " });
    }
  }

  static async removeStock(req: Request, res: Response) {
    const { stockId, qty } = req.body;

    const stock_id = parseInt(stockId, 10);
    const quantity = parseInt(qty, 10);

    if (!stock_id) {
      res.status(400).json({ msg: "Stock Id is required!" });
    }

    if (isNaN(stock_id)) {
      res.status(400).json({ msg: "Stock Id must be an integer." });
    }

    if (quantity) {
      if (isNaN(quantity)) {
        res.status(400).json({ msg: "Quantity must be an integer." });
      } else {
        try {
          await StockService.updateStock(stock_id, quantity);
          res.status(200).send({ msg: "Stock updated!" });
        } catch (err) {
          console.error("Error updating stock ", err);
          res.status(500).json({ msg: "Error updating stock" });
        }
      }
    }
    try {
      await StockService.removeStock(stock_id);
      res.status(200).send({ msg: "Stock removed!" });
    } catch (error) {
      console.log("Error removing stock ", error);
      res.status(500).json({ msg: "Error removing stock" });
    }
  }

  static async sendStock(req: Request, res: Response) {
    const { stockId, qty, src, dest, manager_id } = req.body;
    const stock_id = parseInt(stockId, 10);
    const quantity = parseInt(qty, 10);
    const source_id = parseInt(src, 10);
    const destination_id = parseInt(dest, 10);

    if (
      isNaN(stock_id) ||
      isNaN(quantity) ||
      isNaN(source_id) ||
      isNaN(destination_id)
    ) {
      res.status(400).json({
        msg: "Stock Id, Quantity, Source Id and Destination Id must be integers.",
      });
    }

    try {
      await StockService.sendStock(
        stock_id,
        quantity,
        destination_id,
        manager_id
      );
    } catch (error) {
      console.log("Error sending stock ", error);
      res.status(400).json({ msg: "Error sending stock" });
    }
  }
}
