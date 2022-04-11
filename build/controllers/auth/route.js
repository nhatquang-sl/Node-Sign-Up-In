"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = __importDefault(require("./handlers/register"));
const login_1 = __importDefault(require("./handlers/login"));
const refresh_token_1 = __importDefault(require("./handlers/refresh-token"));
const logout_1 = __importDefault(require("./handlers/logout"));
const router = express_1.default.Router();
router.post('/register', register_1.default);
router.post('/login', login_1.default);
router.post('/refresh-token', refresh_token_1.default);
router.post('/logout', logout_1.default);
exports.default = router;
