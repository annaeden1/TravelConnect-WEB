import type { Request, Response } from "express";
import { Model } from "mongoose";
import { stringify } from "qs";

class genericController<T> {
  model: Model<T>;

  constructor(dataModel: any) {
    this.model = dataModel;
  }

  async create(req: Request, res: Response) {
    const obj = req.body;
    try {
      const response = await this.model.create(obj);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params._id;
    const newDoc = { ...req.body, id };

    try {
      const updated = await this.model.findByIdAndUpdate(id, newDoc, {
        new: true,
      });

      if (!updated) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
      }

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  async get(req: Request, res: Response) {
    const filter = req.query;
    try {
      if (Object.keys(filter).length > 0) {
        const data = await this.model.find(filter);
        if (!data || data.length === 0) {
          return res
            .status(404)
            .json({ error: `Data not found with filter ${stringify(filter)}` });
        }
        res.status(200).json(data);
      } else {
        const data = await this.model.find();
        if (!data || data.length === 0) {
          return res.status(404).json({ error: "Data not found" });
        }
        res.status(200).json(data);
      }
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params._id;
    try {
      const data = await this.model.findById(id);
      if (!data) {
        return res.status(404).json({ error: `Data with id ${id} not found` });
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params._id;
    try {
      const response = await this.model.findByIdAndDelete(id);

      if (!response) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
      }

      res.status(200).json(response);
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
    }
  }
}
export default genericController;
