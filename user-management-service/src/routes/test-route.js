import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello from tst route - product catalouge");
});

export { router as testRoute };
