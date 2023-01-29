import express from "express";
const router = express.Router();
import AccountController from "../controllers/account.controller.js";

router.post("/", AccountController.save);
router.get("/", AccountController.all);
router.get("/:id", AccountController.byId);
router.delete("/:id", AccountController.remove);
router.put("/:id", AccountController.update);
router.patch("/updateBalance/:id", AccountController.updateBalance);

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
