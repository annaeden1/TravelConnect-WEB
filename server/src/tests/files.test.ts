import request from "supertest";
import { Express } from "express";
import { getLoggedInUser, UserData } from "./types/userData";
import intApp from "../index";

let app: Express;
let loginUser: UserData;

beforeAll(async () => {
  app = await intApp();
  loginUser = await getLoggedInUser(app);
});

describe("File Tests", () => {
  test("upload file", async () => {
    const filePath = `${__dirname}\\cuteDraw.jpg`;

    const response = await request(app)
      .post("/file")
      .attach("file", filePath)
      .set("Authorization", "Bearer " + loginUser.token);

    expect(response.statusCode).toBe(200);

    let url = response.body.url;
    url = url.replace(/^.*\/\/[^/]+/, "");

    const res = await request(app).get(url);
    expect(res.statusCode).toBe(200);
  });

  test("upload file without file", async () => {
    const response = await request(app)
      .post("/file?file=123.jpeg")
      .set("Authorization", "Bearer " + loginUser.token);

    expect(response.statusCode).toBe(400);
  });

  test("upload file without auth", async () => {
    const filePath = `${__dirname}/cuteDraw.jpg`;

    try {
      const response = await request(app)
        .post("/file")
        .attach("file", filePath);

      expect(response.statusCode).toBe(401);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;

      if (e?.code === "ECONNRESET") {
        // acceptable outcome for unauthenticated multipart upload
        return;
      }

      // anything else is a real failure
      throw err;
    }
  });

  test("upload file with invalid auth", async () => {
    const filePath = `${__dirname}/cuteDraw.jpg`;

    try {
      const response = await request(app)
        .post("/file")
        .attach("file", filePath)
        .set("Authorization", "Bearer invalidtoken");

      expect(response.statusCode).toBe(401);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;

      if (e?.code === "ECONNRESET") {
        // acceptable outcome for unauthenticated multipart upload
        return;
      }

      // anything else is a real failure
      throw err;
    }
  });
});
