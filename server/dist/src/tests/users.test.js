"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const userModel_1 = require("../models/userModel");
const userData_1 = require("./types/userData");
let loginUser;
const testData = [
    {
        username: "John Doeeeee",
        email: "john@example.com",
        password: "password123",
        profileImage: "",
        token: "",
        refreshTokens: [""]
    },
    {
        username: "Jane Smith",
        email: "jane@example.com",
        password: "password456",
        profileImage: "",
        token: "",
        refreshTokens: [""]
    },
    {
        username: "Alice Johnson",
        email: "alice@example.com",
        password: "password789",
        profileImage: "",
        token: "",
        refreshTokens: [""]
    },
];
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    loginUser = yield (0, userData_1.getLoggedInUser)(app);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.userModel.deleteMany({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.userModel.deleteMany({});
}));
describe("User API Endpoints", () => {
    test("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const data of testData) {
            const res = yield (0, supertest_1.default)(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(data);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("_id"); // Mongoose usually returns '_id', not 'id'
            expect(res.body.username).toBe(data.username);
            expect(res.body.email).toBe(data.email);
        }
    }));
    test("should retrieve all users", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const data of testData) {
            yield (0, supertest_1.default)(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(data);
        }
        const res = yield (0, supertest_1.default)(app).get("/user").set("Authorization", "Bearer " + loginUser.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(testData.length);
    }));
    test("should retrieve a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
        const userId = createRes.body._id;
        const res = yield (0, supertest_1.default)(app).get(`/user/${userId}`).set("Authorization", "Bearer " + loginUser.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toBe(testData[0].username);
        expect(res.body.email).toBe(testData[0].email);
    }));
    test("should update a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(app).post("/user").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
        const userId = createRes.body._id;
        const updatedData = {
            username: "Updated Name",
            email: "updated@example.com",
        };
        const res = yield (0, supertest_1.default)(app).put(`/user/${userId}`).set("Authorization", "Bearer " + loginUser.token).send(updatedData);
        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toBe(updatedData.username);
        expect(res.body.email).toBe(updatedData.email);
    }));
});
//# sourceMappingURL=users.test.js.map