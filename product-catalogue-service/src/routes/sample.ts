// routes/sample.js
/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
import express from "express";

const router = express.Router();

router.get("/sample", (req, res) => {
  res.json({ message: "This is a sample message" });
});

export { router as sample };
