"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const utils_1 = require("@medusajs/utils");
const core_1 = __importDefault(require("./core"));
const route = (0, express_1.Router)();
route.use(body_parser_1.default.json());
route.use(body_parser_1.default.raw({ type: 'application/octet-stream' }));
exports.default = (app) => {
    app.use("/webhook", route);
    route.get("/health", (req, res) => {
        res.sendStatus(200);
    });
    route.post("/razorpay", (0, utils_1.wrapHandler)(core_1.default));
    return app;
};
