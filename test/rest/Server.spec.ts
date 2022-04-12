// import Server from "../../src/rest/Server";
// import InsightFacade from "../../src/controller/InsightFacade";
// import chai, {expect, use} from "chai";
// import chaiHttp from "chai-http";
// import * as fs from "fs";
// import {App} from "../../src/App";
// import {clearDatasets} from "../resources/TestUtils";
//
// describe("Facade D3", function () {
//
// 	let facade: InsightFacade;
// 	let server: Server;
// 	let app: App;
//
// 	use(chaiHttp);
//
// 	before(function () {
// 		facade = new InsightFacade();
// 		server = new Server(4321);
// 		server.start();
// 		// TODO: start server here once and handle errors properly
// 	});
//
// 	after(function () {
// 		server.stop();
// 		clearDatasets();
// 	});
//
// 	beforeEach(function () {
// 		// might want to add some process logging here to keep track of what"s going on
// 		// clearDatasets();
// 	});
//
// 	afterEach(function () {
// 		// might want to add some process logging here to keep track of what"s going on
// 	});
//
// 	// Sample on how to format PUT requests
// 	it("PUT test for courses dataset - normal", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.put("/dataset/id1/courses")
// 				.send(fs.readFileSync("./test/resources/archives/courses.zip"))
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 					console.log(res.body);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 		}
// 	});
// 	it("PUT test for courses dataset - duplicate id, courses", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.put("/dataset/id1/courses")
// 				.send(fs.readFileSync("./test/resources/archives/courses.zip"))
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(400);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log(err);
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 		}
// 	});
// 	it("PUT test for courses dataset - duplicate RANDOM", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.put("/dataset/id1/courses")
// 				.send(Buffer.from("sfds"))
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(400);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					console.log(err);
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 		}
// 	});
// 	it("PUT test for courses dataset - room", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.put("/dataset/id1/rooms")
// 				.send(Buffer.from("fvfghhy", "base64"))
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(400);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 					console.log(err);
// 				});
// 		} catch (err) {
// 			expect.fail();
// 			// and some more logging here!
// 		}
// 	});
// 	it("PUT test for courses dataset - 2", function () {
// 		this.timeout(20000000);
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.put("/dataset/id1/rooms")
// 				.send(Buffer.from("UEsDBAoAAAAIAAEiJEm/nBg/EQAAAA8AAAALAAAAY29udGVudC5vYmqr" +
// 					"VspOrVSyUipLzClNVaoFAFBLAQIUAAoAAAAIAAEiJEm/nBg/EQAAAA8AAAALAAAAAAAAAAAAAAAAAAAAA" +
// 					"ABjb250ZW50Lm9ialBLBQYAAAAAAQABADkAAAA6AAAAAAA=", "base64"))
// 				.set("Content-Type", "application/x-zip-compressed")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(400);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			expect.fail();
// 		}
// 		this.done();
// 	});
// 	it("GET test- should have 1 dataset bc adding duplicate resulted in error above", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.get("/dataset")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(200);
// 					console.log(res.body);
// 				})
// 				.catch(function (err) {
// 					// some logging here please!
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			// and some more logging here!
// 		}
// 	});
// 	it("DELETE test", function () {
// 		try {
// 			return chai.request("http://localhost:4321")
// 				.delete("/dataset/id2")
// 				.then(function (res: ChaiHttp.Response) {
// 					// some logging here please!
// 					expect(res.status).to.be.equal(404);
// 				})
// 				.catch(function (err) {
// 					expect.fail();
// 				});
// 		} catch (err) {
// 			expect.fail();
// 			// and some more logging here!
// 		}
// 	});
// });
