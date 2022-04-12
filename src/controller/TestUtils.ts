import * as fs from "fs-extra";
const persistDir = "./data";

function getFileContent(name: string): string {
	return fs.readFileSync(`test/resources/archives/${name}`).toString("base64");
}

/**
 * Wipes all state of InsightFacade
 * Meant to be used between tests
 */
function clearDatasets(): void {
	fs.removeSync(persistDir);
}

function clearData(id: string): void {
	fs.removeSync(persistDir + "/" + id);
}

export {getFileContent, persistDir, clearDatasets, clearData};
