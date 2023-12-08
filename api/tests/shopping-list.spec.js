import chai, { expect, use } from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import { slugify } from "../utils/string.js";

import ShoppingList from "../models/shopping-list.js";
import User from "../models/user.js";

const should = chai.should();
chai.use(chaiHttp);


async function index() {
    const testServer = await server("mongodb+srv://admin:test@cluster0.25shizm.mongodb.net/test?retryWrites=true&w=majority", 8001, true);
    testing(testServer);
} 

function testing(server) {
    describe("Testing /shopping-list endpoint", () => {

        it("should verify that we have 0 shopping lists in the DB", (done) => {
            chai.request(server)
            .get("/shopping-list")
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.eql(0);
                done();
            });
        });

        it("should create a shopping list", (done) => {
            chai.request(server)
            .post("/shopping-list/edit-or-create")
            .send({name: "Test Shopping list", id: 0})
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it("should cannot create a shopping list with wrong attributes", (done) => {
            chai.request(server)
            .post("/shopping-list/edit-or-create")
            .send({id: 0})
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        let shoppingListID = "";
        it("should verify can get shopping list by right slug", (done) => {
            chai.request(server)
            .get(`/shopping-list/${slugify("Test Shopping list")}`)
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                shoppingListID = res.body.list._id;
                done();
            });
        });
        it("should verify cannot get shopping list by wrong slug", (done) => {
            chai.request(server)
            .get(`/shopping-list/${slugify("Špatný slug")}`)
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
        });
        it("should verify that we have 1 shopping list in the DB", (done) => {
            chai.request(server)
            .get("/shopping-list")
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.eql(1);
                done();
            });
        });

        it("should verify cannot create a shopping list because of same name", (done) => {
            chai.request(server)
            .post("/shopping-list/edit-or-create")
            .send({name: "Test Shopping list", id: 0})
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it("should verify can edit a shopping list", (done) => {
            chai.request(server)
            .post("/shopping-list/edit-or-create")
            .send({name: "Test2 Shopping list", id: shoppingListID})
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it("should verify cannot edit a shopping list with wrong id", (done) => {
            chai.request(server)
            .post("/shopping-list/edit-or-create")
            .send({name: "Test2 Shopping list", id: "wrong id"})
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it("should verify cannot delete a shopping list with wrong id", (done) => {
            chai.request(server)
            .delete("/shopping-list/delete/wrongId")
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
        });

        it("should verify can delete a shopping list", (done) => {
            chai.request(server)
            .delete(`/shopping-list/delete/${shoppingListID}`)
            .set("Authorization", "bearer $2a$12$erYefxNdI/Cu1lVRV6za0.KdWVwgoqNZ79grqSkI6rxO9T5BtiNkC")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        after(async () => {
            await ShoppingList.deleteMany();
            await User.deleteMany();
        });
    });  
}

await index();