"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const route_1 = __importDefault(require("./controllers/auth/route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express_1.default.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express_1.default.json());
// Serve static files
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/auth', route_1.default);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
