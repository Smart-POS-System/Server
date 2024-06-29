import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello from tst route - Inventory");
});

export { router as testRoute };
