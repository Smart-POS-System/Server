// routes/test-route.js
/**
 * @swagger
 * /test:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */

import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("hello from tst route - product catalouge");
});

export { router as testRoute };
