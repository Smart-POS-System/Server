import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Item } from "../entities/Item";

const router = express.Router();

router.get("/sample", async (req: Request, res: Response) => {
  const itemRepository = AppDataSource.getRepository(Item);

  try {
    const items = await itemRepository.find({
      relations: ["product"],
    });
    res.json(items).status(201);
  } catch (error) {}
});

export { router as sample };
