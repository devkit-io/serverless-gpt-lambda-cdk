import {Router} from "express";
import {handler} from "./chat/route";

const router = Router();


router.post('/chat', handler);

router.get('/health_check', (req, res) => {
  console.debug("health check running");
  res.status(200).json({message: 'ok'})
});

export default router;