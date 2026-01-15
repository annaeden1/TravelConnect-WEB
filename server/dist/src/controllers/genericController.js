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
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = require("qs");
class genericController {
    constructor(dataModel) {
        this.model = dataModel;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = req.body;
            try {
                const response = yield this.model.create(obj);
                res.status(201).json(response);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "An unknown error occurred",
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params._id;
            const newDoc = Object.assign(Object.assign({}, req.body), { id });
            try {
                const updated = yield this.model.findByIdAndUpdate(id, newDoc, {
                    new: true,
                });
                if (!updated) {
                    return res.status(404).json({ error: `Item with id ${id} not found` });
                }
                res.status(200).json(updated);
            }
            catch (error) {
                res.status(500).json({
                    error: error instanceof Error ? error.message : "An unknown error occurred",
                });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = req.query;
            try {
                if (Object.keys(filter).length > 0) {
                    const data = yield this.model.find(filter);
                    if (!data || data.length === 0) {
                        return res
                            .status(404)
                            .json({ error: `Data not found with filter ${(0, qs_1.stringify)(filter)}` });
                    }
                    res.status(200).json(data);
                }
                else {
                    const data = yield this.model.find();
                    if (!data || data.length === 0) {
                        return res.status(404).json({ error: "Data not found" });
                    }
                    res.status(200).json(data);
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                    error: error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params._id;
            try {
                const data = yield this.model.findById(id);
                if (!data) {
                    return res.status(404).json({ error: `Data with id ${id} not found` });
                }
                else {
                    res.status(200).json(data);
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                    error: error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params._id;
            try {
                const response = yield this.model.findByIdAndDelete(id);
                if (!response) {
                    return res.status(404).json({ error: `Item with id ${id} not found` });
                }
                res.status(200).json(response);
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                    error: error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                });
            }
        });
    }
}
exports.default = genericController;
//# sourceMappingURL=genericController.js.map