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
const commentModel_1 = require("../models/commentModel");
const testData = [
    {
        relatedPostID: "648a1f4e2f8fb814c8a1e1a1",
        description: "This is a test comment 1",
        userCreatorID: "507f1f77bcf86cd799439011",
    },
    {
        relatedPostID: "648a1f4e2f8fb814c8a1e1a2",
        description: "This is a test comment 2",
        userCreatorID: "648a1f4e2f8fb814c8a1e1b2",
    },
    {
        relatedPostID: "648a1f4e2f8fb814c8a1e1a3",
        description: "This is a test comment 3",
        userCreatorID: "648a1f4e2f8fb814c8a1e1b3",
    },
];
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, index_1.default)();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield commentModel_1.commentModel.deleteMany({});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield commentModel_1.commentModel.deleteMany({});
}));
describe("Comment API Endpoints", () => {
    test("should create a new comment", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const data of testData) {
            const res = yield (0, supertest_1.default)(app).post("/comment").send(data);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.description).toBe(data.description);
            expect(res.body.relatedPostID).toBe(data.relatedPostID);
            expect(res.body.userCreatorID).toBe(data.userCreatorID);
        }
    }));
    test("should retrieve all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const data of testData) {
            yield (0, supertest_1.default)(app).post("/comment").send(data);
        }
        const res = yield (0, supertest_1.default)(app).get("/comment");
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(testData.length);
    }));
    test("should retrieve comments for a specific post", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const data of testData) {
            yield (0, supertest_1.default)(app).post("/comment").send(data);
        }
        const relatedPostID = testData[0].relatedPostID;
        const res = yield (0, supertest_1.default)(app).get(`/comment?relatedPostID=${relatedPostID}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].relatedPostID).toBe(relatedPostID);
    }));
});
test("should retrieve a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
    const createRes = yield (0, supertest_1.default)(app).post("/comment").send(testData[0]);
    const commentId = createRes.body._id;
    const res = yield (0, supertest_1.default)(app).get(`/comment/${commentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBe(commentId);
    expect(res.body.description).toBe(testData[0].description);
}));
test("should update a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
    const createRes = yield (0, supertest_1.default)(app).post("/comment").send(testData[0]);
    const commentId = createRes.body._id;
    const updatedData = {
        description: "Updated comment description",
    };
    const res = yield (0, supertest_1.default)(app).put(`/comment/${commentId}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toBe(updatedData.description);
}));
test("should delete a comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
    const createRes = yield (0, supertest_1.default)(app).post("/comment").send(testData[0]);
    const commentId = createRes.body._id;
    const res = yield (0, supertest_1.default)(app).delete(`/comment/${commentId}`);
    expect(res.statusCode).toEqual(200);
    const getRes = yield (0, supertest_1.default)(app).get(`/comment/${commentId}`);
    expect(getRes.statusCode).toEqual(404);
}));
//# sourceMappingURL=comments.test.js.map