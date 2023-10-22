import express from "express";
import cors from "cors";
import apiRoutes from "./api";
import {errorResponder} from "./middleware/errorResponder";

export const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/api/v1', apiRoutes);
app.use(errorResponder);