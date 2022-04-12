"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const InsightFacade_1 = __importDefault(require("../controller/InsightFacade"));
const IInsightFacade_1 = require("../controller/IInsightFacade");
let insightFacade = new InsightFacade_1.default();
class Server {
    constructor(port) {
        console.info(`Server::<init>( ${port} )`);
        this.port = port;
        this.express = (0, express_1.default)();
        this.registerMiddleware();
        this.registerRoutes();
        this.express.use(express_1.default.static("./frontend/public"));
    }
    start() {
        return new Promise((resolve, reject) => {
            console.info("Server::start() - start");
            if (this.server !== undefined) {
                console.error("Server::start() - server already listening");
                reject();
            }
            else {
                this.server = this.express.listen(this.port, () => {
                    console.info(`Server::start() - server listening on port: ${this.port}`);
                    resolve();
                }).on("error", (err) => {
                    console.error(`Server::start() - server ERROR: ${err.message}`);
                    reject(err);
                });
            }
        });
    }
    stop() {
        console.info("Server::stop()");
        return new Promise((resolve, reject) => {
            if (this.server === undefined) {
                console.error("Server::stop() - ERROR: server not started");
                reject();
            }
            else {
                this.server.close(() => {
                    console.info("Server::stop() - server closed");
                    resolve();
                });
            }
        });
    }
    registerMiddleware() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.raw({ type: "application/*", limit: "10mb" }));
        this.express.use((0, cors_1.default)());
    }
    registerRoutes() {
        this.express.get("/echo/:msg", Server.echo);
        this.express.put("/dataset/:id/:kind", Server.putDataset);
        this.express.post("/query", Server.postQuery);
        this.express.delete("/dataset/:id", Server.deleteDataset);
        this.express.get("/dataset", Server.getDataSet);
    }
    static putDataset(req, res) {
        try {
            let kind;
            if (req.params.kind === "courses" || req.params.kind === "rooms") {
                if (req.params.kind === "courses") {
                    kind = IInsightFacade_1.InsightDatasetKind.Courses;
                }
                else {
                    kind = IInsightFacade_1.InsightDatasetKind.Rooms;
                }
                let buffer = Buffer.from(req.body).toString("base64");
                if (!(buffer === "")) {
                    let id = req.params.id;
                    insightFacade.addDataset(id, buffer, kind).then(function (response) {
                        res.status(200);
                        res.json({ result: response });
                    }).catch(function (err) {
                        console.log("400");
                        res.status(400).json({ error: err.toString() });
                    });
                }
                else {
                    res.status(400).json({ error: "empty buffer" });
                }
            }
            else {
                res.status(400);
                res.json({ error: "InsightError" });
            }
        }
        catch {
            res.status(400);
            res.json({ error: "Error" });
        }
    }
    static postQuery(req, res) {
        try {
            let query = req.body;
            insightFacade.performQuery(query).then(function (response) {
                res.status(200);
                res.json({ result: response });
            }).catch(function (err) {
                res.status(400).json({ error: err.toString() });
            });
        }
        catch (err) {
            res.status(400).json({ error: "Error" });
        }
    }
    static deleteDataset(req, res) {
        try {
            if (req.params.id === undefined) {
                res.status(400);
                res.json({ result: "error!!!!1" });
            }
            else {
                insightFacade.removeDataset(req.params.id)
                    .then(function (response) {
                    res.status(200);
                    res.json({ result: response });
                }).catch(function (err) {
                    if (err instanceof IInsightFacade_1.InsightError) {
                        res.status(400);
                    }
                    else {
                        res.status(404);
                    }
                    res.json({ error: err.toString() });
                });
            }
        }
        catch (err) {
            res.status(400).json({ error: "Error" });
        }
    }
    static getDataSet(req, res) {
        insightFacade.listDatasets()
            .then(function (response) {
            res.status(200);
            res.json({ result: response });
        }).catch(() => {
            res.status(400).json({ error: "ANY ERROR" });
        });
    }
    static echo(req, res) {
        try {
            console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
            const response = Server.performEcho(req.params.msg);
            res.status(200).json({ result: response });
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    }
    static performEcho(msg) {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        }
        else {
            return "Message not provided";
        }
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map