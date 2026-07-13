import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  addLabCategory,
  addLabResult,
  addLabTest,
  editLabOrder,
  editLabResult,
  fetchLabOrderById,
  getLabCategories,
  getLabOrders,
  getLabTests,
  registerLabOrder,
  removeLabOrder,
} from "../controllers/laboratory.controller";

const router = Router();

router.use(requireAuth);

router.get("/categories", getLabCategories);
router.post("/categories", addLabCategory);
router.get("/tests", getLabTests);
router.post("/tests", addLabTest);
router.get("/", getLabOrders);
router.get("/:id", fetchLabOrderById);
router.post("/", registerLabOrder);
router.put("/:id", editLabOrder);
router.post("/:id/result", addLabResult);
router.put("/:id/result", editLabResult);
router.delete("/:id", removeLabOrder);

export default router;
