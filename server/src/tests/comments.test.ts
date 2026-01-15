import request from "supertest";
import intApp from "../index";
import { Express } from "express";
import { commentModel } from "../models/commentModel";
import mongoose from "mongoose";
import { CommentData } from "./types/commentData.type";

const testData: CommentData[] = [
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

let app: Express;
beforeAll(async () => {
  app = await intApp();
});
beforeEach(async () => {
  await commentModel.deleteMany({});
});
afterAll(async () => {
  await commentModel.deleteMany({});
});

describe("Comment API Endpoints", () => {
  test("should create a new comment", async () => {
    for (const data of testData) {
      const res = await request(app).post("/comment").send(data);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.description).toBe(data.description);
      expect(res.body.relatedPostID).toBe(data.relatedPostID);
      expect(res.body.userCreatorID).toBe(data.userCreatorID);
    }
  });

  test("should retrieve all comments", async () => {
    for (const data of testData) {
      await request(app).post("/comment").send(data);
    }
    const res = await request(app).get("/comment");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(testData.length);
  });

  test("should retrieve comments for a specific post", async () => {
    for (const data of testData) {
      await request(app).post("/comment").send(data);
    }
    const relatedPostID = testData[0].relatedPostID;
    const res = await request(app).get(
      `/comment?relatedPostID=${relatedPostID}`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].relatedPostID).toBe(relatedPostID);
  });
});

test("should retrieve a comment by ID", async () => {
  const createRes = await request(app).post("/comment").send(testData[0]);
  const commentId = createRes.body._id;
  const res = await request(app).get(`/comment/${commentId}`);
  expect(res.statusCode).toEqual(200);
  expect(res.body._id).toBe(commentId);
  expect(res.body.description).toBe(testData[0].description);
});

test("should update a comment by ID", async () => {
  const createRes = await request(app).post("/comment").send(testData[0]);
  const commentId = createRes.body._id;
  const updatedData = {
    description: "Updated comment description",
  };
  const res = await request(app).put(`/comment/${commentId}`).send(updatedData);
  expect(res.statusCode).toEqual(200);
  expect(res.body.description).toBe(updatedData.description);
});

test("should delete a comment by ID", async () => {
  const createRes = await request(app).post("/comment").send(testData[0]);
  const commentId = createRes.body._id;
  const res = await request(app).delete(`/comment/${commentId}`);
  expect(res.statusCode).toEqual(200);
  const getRes = await request(app).get(`/comment/${commentId}`);
  expect(getRes.statusCode).toEqual(404);
});
