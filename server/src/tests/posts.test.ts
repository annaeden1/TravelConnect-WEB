import request from "supertest";
import intApp from "../index";
import { Express } from "express";
import { PostData } from "./types/postData.type";
import { postModel } from "../models/postModel";
import { getLoggedInUser, UserData } from "./types/userData";

let loginUser: UserData;
const testData: PostData[] = [
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

let app: Express;

beforeAll(async () => {
  app = await intApp();
  loginUser = await getLoggedInUser(app);
});

beforeEach(async () => {
  await postModel.deleteMany({});
});

afterAll(async () => {
  await postModel.deleteMany({});
});

describe("Post API Endpoints", () => {
    describe("create", () => {
        test("should create a new post", async () => {
            for (const data of testData) {
            const res = await request(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(data);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.content).toBe(data.content);
            expect(res.body.userCreatorID).toBe(data.userCreatorID);
            }
        });
    });

    describe("update", () => {
        test("should update an existing post", async () => {
            const createRes = await request(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
            const postId = createRes.body._id;
            const updatedContent = { content: "Updated post content" };
            const res = await request(app).put(`/post/${postId}`).set("Authorization", "Bearer " + loginUser.token).send(updatedContent);
            expect(res.statusCode).toEqual(200);
            expect(res.body.content).toBe(updatedContent.content);
        });

        test("should return 404 for non-existing post", async () => {
            const res = await request(app).put("/post/609e129e1c4ae12f34567890").set("Authorization", "Bearer " + loginUser.token).send({ content: "Updated content" });
            expect(res.statusCode).toEqual(404);
        });
    });

    describe("get", () => {
        test("should retrieve all posts", async () => {
            for (const data of testData) {
                await request(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(data);
            }
            const res = await request(app).get("/post").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(testData.length);
        });

        test("should retrieve posts by filter", async () => {
            for (const data of testData) {
            await request(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(data);
            }
            const res = await request(app).get("/post").query({ userCreatorID: "507f1f77bcf86cd799439011" }).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].userCreatorID).toBe("507f1f77bcf86cd799439011");
        });

        test("should return 404 if no posts found with filter", async () => {
            const res = await request(app).get("/post").query({ userCreatorID: "507f1f77bcf86cd799439010" }).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Data not found with filter userCreatorID=507f1f77bcf86cd799439010");
        });

        test("should return 404 if no posts exist", async () => {
            const res = await request(app).get("/post").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Data not found");
        });
    });

    describe("get by ID", () => {
        test("should retrieve a post by ID", async () => {
            const createRes = await request(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
            const postId = createRes.body._id;
            const res = await request(app).get(`/post/${postId}`).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.content).toBe(testData[0].content);
            expect(res.body.userCreatorID).toBe(testData[0].userCreatorID);
        });

        test("should return 404 for non-existing post ID", async () => {
            const res = await request(app).get("/post/609e129e1c4ae12f34567890").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Data with id 609e129e1c4ae12f34567890 not found");
        });
    });

    describe("delete", () => {
        test("should delete a post by ID", async () => {
            const createRes = await request(app).post("/post").set("Authorization", "Bearer " + loginUser.token).send(testData[0]);
            const postId = createRes.body._id;
            const res = await request(app).delete(`/post/${postId}`).set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(200);
        });

        test("should return 404 for non-existing post ID", async () => {
            const res = await request(app).delete("/post/609e129e1c4ae12f34567890").set("Authorization", "Bearer " + loginUser.token);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("error", "Item with id 609e129e1c4ae12f34567890 not found");
        });
    });
});
