//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();

// Use http for testing.
chai.use(chaiHttp);

//Our parent block
describe("Index", () => {
  describe("/GET index", () => {
    it("should return {status:ok}", done => {
      chai
        .request("http://127.0.0.1:3000")
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status");
          res.body.should.have.property("status").eql("ok");
          done();
        });
    });
  });
  describe("/GET user", () => {
    it("should return all users", done => {
      chai
        .request("http://127.0.0.1:3000")
        .get("/user")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.to.have.lengthOf(3);
          done();
        });
    });
  });
});
