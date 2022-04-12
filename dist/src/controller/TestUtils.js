"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearData = exports.clearDatasets = exports.persistDir = exports.getFileContent = void 0;
const fs = __importStar(require("fs-extra"));
const persistDir = "./data";
exports.persistDir = persistDir;
function getFileContent(name) {
    return fs.readFileSync(`test/resources/archives/${name}`).toString("base64");
}
exports.getFileContent = getFileContent;
function clearDatasets() {
    fs.removeSync(persistDir);
}
exports.clearDatasets = clearDatasets;
function clearData(id) {
    fs.removeSync(persistDir + "/" + id);
}
exports.clearData = clearData;
//# sourceMappingURL=TestUtils.js.map