import express from "express";

const router = express.Router();

router.get("/sample", (req, res) => {
  res.json({ message: "This is a sample message" });
});

export { router as sample };
