import { Request, Response } from "express";
import { StockService } from "../services/stockService";
import { Roles } from "../enums/roles.enum";
import { error } from "console";

export class StockController {
  static async getAllStocks(req: Request, res: Response) {
    const { page_size, current_page } = req.body;

    try {
      const stocks = await StockService.getStocks(
        page_size || 10,
        current_page || 1
      );

      return res.status(200).json(stocks);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Error featching data from database." });
    }
  }

  static async getStocks(req: Request, res: Response) {
    const { role, region_id, location_id, page_size, current_page } = req.body;

    let stocks;

    try {
      if (role === Roles.GENERAL_MANAGER) {
        stocks = await StockService.getStocks(page_size, current_page);
      } else if (role === Roles.REGIONAL_MANAGER) {
        if (region_id) {
          stocks = await StockService.getStocksByRegion(
            region_id,
            page_size,
            current_page
          );
        } else {
          res.status(400).json({ error: "Region id not provided." });
        }
      } else if (
        role === Roles.INVENTORY_MANAGER ||
        role === Roles.STORE_MANAGER ||
        role === Roles.CASHIER
      ) {
        if (location_id) {
          stocks = await StockService.getStocksByLocation(
            location_id,
            page_size,
            current_page
          );
        } else {
          res.status(400).json({ error: "Location id not provided." });
        }
      }
      res.status(200).json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data from database." });
    }
  }

  static async getExpires(req: Request, res: Response) {
    const { type, role, region_id, location_id, page_size, current_page } =
      req.body;

    try {
      let expires;

      if (role === Roles.GENERAL_MANAGER) {
        if (type === "expired") {
          expires = await StockService.getExpired(page_size, current_page);
        } else if (type === "expiring") {
          expires = await StockService.getExpiring(page_size, current_page);
        } else {
          return res
            .status(400)
            .json({ error: "Mention the type: expiring or expired." });
        }
      } else if (role === Roles.REGIONAL_MANAGER) {
        if (!region_id) {
          return res.status(400).json({ error: "Region id not provided." });
        }
        if (type === "expired") {
          expires = await StockService.getExpiredByRegion(
            region_id,
            page_size,
            current_page
          );
        } else if (type === "expiring") {
          expires = await StockService.getExpiringByRegion(
            region_id,
            page_size,
            current_page
          );
        } else {
          return res
            .status(400)
            .json({ error: "Mention the type: expiring or expired." });
        }
      } else if (
        role === Roles.INVENTORY_MANAGER ||
        role === Roles.STORE_MANAGER ||
        role === Roles.CASHIER
      ) {
        if (!location_id) {
          return res.status(400).json({ error: "Location id not provided." });
        }
        if (type === "expired") {
          expires = await StockService.getExpiredByLocation(
            location_id,
            page_size,
            current_page
          );
        } else if (type === "expiring") {
          expires = await StockService.getExpiringByLocation(
            location_id,
            page_size,
            current_page
          );
        } else {
          return res
            .status(400)
            .json({ error: "Mention the type: expiring or expired." });
        }
      }

      // if (type === "expired") {
      //   expires = await StockService.getExpired(
      //     location_id,
      //     page_size,
      //     current_page
      //   );
      // } else if (type === "expiring") {
      //   expires = await StockService.getExpiring(
      //     location_id,
      //     page_size,
      //     current_page
      //   );
      // } else {
      //   return res
      //     .status(400)
      //     .json({ error: "Mention the type: expiring or expired." });
      // }
      res.status(200).json(expires);
    } catch (error) {
      console.error("Error fetching expiring data:", error);
      return res.status(500).json({ error: "Error fetching expiring data." });
    }
  }

  static async addStock(req: Request, res: Response) {
    const { item_id, barcode, quantity, location_id, manager_id } = req.body;

    if (!item_id || !barcode || !quantity || !location_id || !manager_id) {
      return res.status(400).json({
        error:
          "All fields are required: item_id, barcode, quantity, location_id, manager_id.",
      });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        error: "Quantity must be a positive number.",
      });
    }

    try {
      const savedStock = await StockService.addStock(
        item_id,
        barcode,
        quantity,
        location_id,
        manager_id
      );

      res.status(201).json({ error: "New stock added!", stock: savedStock });
    } catch (error) {
      console.error("Error adding new stock:", error);
      res
        .status(500)
        .json({ error: "Error adding new stock. Please try again later." });
    }
  }

  static async removeStock(req: Request, res: Response) {
    const { stockId, qty } = req.body;

    const stock_id = parseInt(stockId, 10);
    const quantity = parseInt(qty, 10);

    if (!stock_id) {
      res.status(400).json({ error: "Stock Id is required!" });
    }

    if (isNaN(stock_id)) {
      res.status(400).json({ error: "Stock Id must be an integer." });
    }

    if (quantity) {
      if (isNaN(quantity)) {
        res.status(400).json({ error: "Quantity must be an integer." });
      } else {
        try {
          await StockService.updateStock(stock_id, quantity);
          // res.status(200).send({ error: "Stock updated!" });
        } catch (err) {
          console.error("Error updating stock ", err);
          // res.status(500).json({ error: "Error updating stock" });
        }
      }
    }
    try {
      await StockService.removeStock(stock_id);
      res.status(200).send({ error: "Stock removed!" });
    } catch (error) {
      console.log("Error removing stock ", error);
      res.status(500).json({ error: "Error removing stock" });
    }
  }

  static async sendStock(req: Request, res: Response) {
    const { stockId, barcode, qty, src, dest, manager_id } = req.body;
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
        error:
          "Stock Id, Quantity, Source Id and Destination Id must be integers.",
      });
    }

    try {
      await StockService.sendStock(
        stock_id,
        barcode,
        quantity,
        destination_id,
        manager_id
      );
    } catch (error) {
      console.log("Error sending stock ", error);
      res.status(400).json({ error: "Error sending stock" });
    }
  }
}
