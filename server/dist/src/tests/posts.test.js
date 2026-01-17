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
const postModel_1 = require("../models/postModel");
const userData_1 = require("./types/userData");
let loginUser;
const testData = [
    {
        content: "This is a test post",
        imageUrl: "http://example.com/post-image.jpg",
        userCreatorID: "507f1f77bcf86cd799439011",
    },
    {
        content: "Another test post",
        imageUrl: "http://example.com/post-image2.jpg",
        userCreatorID: "507f1f77bcf86cd799439012",
    },
    {
        content: "Yet another test post",
        imageUrl: "http://example.com/post-image3.jpg",
        userCreatorID: "507f1f77bcf86cd799439013",
    },
];
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
    loginUser = yield (0, userData_1.getLoggedInUser)(app);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield postModel_1.postModel.deleteMany({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield postModel_1.postModel.deleteMany({});
}));
describe("Post API Endpoints", () => {
    describe("create", () => {
        test("should create a new post", () => __awaiter(void 0, void 0, void 0, function* () {
            for (const data of testData) {
                const res = yield (0, supertest_1.default)(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(data);
                expect(res.statusCode).toEqual(201);
                expect(res.body).toHaveProperty("_id");
                expect(res.body.content).toBe(data.content);
                expect(res.body.userCreatorID).toBe(data.userCreatorID);
            }
        }));
    });
    describe("update", () => {
        test("should update an existing post", () => __awaiter(void 0, void 0, void 0, function* () {
            const createRes = yield (0, supertest_1.default)(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
            const postId = createRes.body._id;
            const updatedContent = { content: "Updated post content" };
            const res = yield (0, supertest_1.default)(app).put(`/post/${postId}`).set("Authorization", "Bearer " + loginUser.token).send(updatedContent);
            expect(res.statusCode).toEqual(200);
            expect(res.body.content).toBe(updatedContent.content);
        }));
        test("should return 404 for non-existing post", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).put("/post/609e129e1c4ae12f34567890").set("Authorization", "Bearer " + loginUser.token).send({ content: "Updated content" });
            expect(res.statusCode).toEqual(404);
        }));
    });
    describe("get", () => {
        test("should retrieve all posts", () => __awaiter(void 0, void 0, void 0, function* () {
            for (const data of testData) {
                yield (0, supertest_1.default)(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(data);
            }
            const res = yield (0, supertest_1.default)(app).get("/post").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(testData.length);
        }));
        test("should retrieve posts by filter", () => __awaiter(void 0, void 0, void 0, function* () {
            for (const data of testData) {
                yield (0, supertest_1.default)(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(data);
            }
            const res = yield (0, supertest_1.default)(app).get("/post").query({ userCreatorID: "507f1f77bcf86cd799439011" }).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].userCreatorID).toBe("507f1f77bcf86cd799439011");
        }));
        test("should return 404 if no posts found with filter", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/post").query({ userCreatorID: "507f1f77bcf86cd799439010" }).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Data not found with filter userCreatorID=507f1f77bcf86cd799439010");
        }));
        test("should return 404 if no posts exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/post").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Data not found");
        }));
    });
    describe("get by ID", () => {
        test("should retrieve a post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const createRes = yield (0, supertest_1.default)(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
            const postId = createRes.body._id;
            const res = yield (0, supertest_1.default)(app).get(`/post/${postId}`).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.content).toBe(testData[0].content);
            expect(res.body.userCreatorID).toBe(testData[0].userCreatorID);
        }));
        test("should return 404 for non-existing post ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/post/609e129e1c4ae12f34567890").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Data with id 609e129e1c4ae12f34567890 not found");
        }));
    });
    describe("delete", () => {
        test("should delete a post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const createRes = yield (0, supertest_1.default)(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
            const postId = createRes.body._id;
            const res = yield (0, supertest_1.default)(app).delete(`/post/${postId}`).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
        }));
        test("should return 404 for non-existing post ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).delete("/post/609e129e1c4ae12f34567890").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Item with id 609e129e1c4ae12f34567890 not found");
        }));
    });
});
//# sourceMappingURL=posts.test.js.map