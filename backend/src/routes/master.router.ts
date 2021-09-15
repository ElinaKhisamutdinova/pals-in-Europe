import { Router } from "express";

import {
  createMaster,
  loginMaster,
  getAllMasters,
  getAccountMaster,
  editMasterProfile,
  // getAuthorReviews
  test,
  getMasterOrder,
  getReviews
} from "../controllers/master";

const router = Router();

router.get("/", getAllMasters);

router.post("/signup", createMaster);

router.post("/login", loginMaster);

router.get("/account", getAccountMaster);

router.post("/edit", editMasterProfile);

router.get("/orders", getMasterOrder);

router.get("/reviews", getReviews)
router.get("/test/:id", test)

export default router;
