import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import httpStatus from "http-status";
import supertest from "supertest";
import authFactory from "../factories/auth-factory";
import userFactory from "../factories/user-factory";
import clientFactory from "../factories/clients-factory";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import addressFactory from "../factories/address-factory";
 

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});


const server = supertest(app);

describe("POST /address", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.post("/address");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.post("/address").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.post("/address").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when body is blank", async () => {

            const token = await generateValidToken()

            const body = {}

            const response = await server.post("/address").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when clientId not exist", async () => {

            const token = await generateValidToken()

            //const client = await clientFactory.findAllClients()

            const body = await addressFactory.generateAddressValidBody(1)

            const response = await server.post("/address").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when body is valid", () => {

            it("should respond with status 201 when already have a registered client", async () => {

                const token = await generateValidToken()

                const client = await clientFactory.findAllClients()

                const body = await addressFactory.generateAddressValidBody(client[0].id)

                const response = await server.post("/address").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.CREATED);

            });

            it("should respond with client Data", async () => {

                const token = await generateValidToken()

                const client = await clientFactory.findAllClients()

                const body = await addressFactory.generateAddressValidBody(client[0].id)

                const response = await server.post("/address").set("Authorization", `Bearer ${token}`).send(body)

                const address = addressFactory.getAddressById(response.body.id)

                expect(response.body).toBe(address);
            });
        })
    })
});

describe("GET /address/all/:clientId", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.get("/address/all/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.get("/address/all/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get("/address/all/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when params is a string", async () => {

            const token = await generateValidToken()

            const client = await clientFactory.findAllClients()

            const body = await addressFactory.generateAddressValidBody(client[0].id)

            const address = await addressFactory.createAddress(body)

            const response = await server.get("/address/all/1A").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when clientId not exist", async () => {

            const token = await generateValidToken()

            const client = await clientFactory.findAllClients()

            const body = await addressFactory.generateAddressValidBody(client[0].id)

            const address = await addressFactory.createAddress(body)

            const response = await server.get("/address/all/1").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        describe("when body is valid", () => {

            it("should respond with status 201 when already have a registered client", async () => {

                const token = await generateValidToken()
    
                const client = await clientFactory.findAllClients()
    
                const body = await addressFactory.generateAddressValidBody(client[0].id)
    
                const address = await addressFactory.createAddress(body)
    
                const response = await server.get(`/address/all/${client[0].id}`).set("Authorization", `Bearer ${token}`).send(body)
    
                expect(response.status).toBe(httpStatus.OK);
                

            });

            it("should respond with all client address data", async () => {

                const token = await generateValidToken()
        
                const client = await clientFactory.findAllClients()
    
                const body = await addressFactory.generateAddressValidBody(client[0].id)

                const secondBody = await addressFactory.generateAddressValidBody(client[0].id)
    
                const address = await addressFactory.createAddress(body)

                const secondAddress = await addressFactory.createAddress(secondBody)
    
                const response = await server.get(`/address/all/${client[0].id}`).set("Authorization", `Bearer ${token}`).send(body)

                const allAddress = await addressFactory.getAllClientAddress(client[0].id)
    
                expect(response.body).toEqual(allAddress);
            });

            it("should respond with all client address data (1 address)", async () => {

                const token = await generateValidToken()
        
                const client = await clientFactory.findAllClients()
    
                const body = await addressFactory.generateAddressValidBody(client[0].id)
    
                const address = await addressFactory.createAddress(body)
    
                const response = await server.get(`/address/all/${client[0].id}`).set("Authorization", `Bearer ${token}`).send(body)

                const allAddress = await addressFactory.getAllClientAddress(client[0].id)
    
                expect(response.body).toEqual(allAddress);
            });
        })
    })
});
/*
describe("GET /address/unique/:addressId", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.get("/address/all/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.get("/address/all/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get("/address/all/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when params is a string", async () => {

            const token = await generateValidToken()

            const client = await clientFactory.findAllClients()

            const body = await addressFactory.generateAddressValidBody(client[0].id)

            const address = await addressFactory.createAddress(body)

            const response = await server.get("/address/all/1A").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when clientId not exist", async () => {

            const token = await generateValidToken()

            const client = await clientFactory.findAllClients()

            const body = await addressFactory.generateAddressValidBody(client[0].id)

            const address = await addressFactory.createAddress(body)

            const response = await server.get("/address/all/1").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        describe("when body is valid", () => {

            it("should respond with status 201 when already have a registered client", async () => {

                const token = await generateValidToken()
    
                const client = await clientFactory.findAllClients()
    
                const body = await addressFactory.generateAddressValidBody(client[0].id)
    
                const address = await addressFactory.createAddress(body)
    
                const response = await server.get(`/address/all/${client[0].id}`).set("Authorization", `Bearer ${token}`).send(body)
    
                expect(response.status).toBe(httpStatus.OK);
                

            });

            it("should respond with all client address data", async () => {

                const token = await generateValidToken()
        
                const client = await clientFactory.findAllClients()
    
                const body = await addressFactory.generateAddressValidBody(client[0].id)

                const secondBody = await addressFactory.generateAddressValidBody(client[0].id)
    
                const address = await addressFactory.createAddress(body)

                const secondAddress = await addressFactory.createAddress(secondBody)
    
                const response = await server.get(`/address/all/${client[0].id}`).set("Authorization", `Bearer ${token}`).send(body)

                const allAddress = await addressFactory.getAllClientAddress(client[0].id)
    
                expect(response.body).toEqual(allAddress);
            });

            it("should respond with all client address data (1 address)", async () => {

                const token = await generateValidToken()
        
                const client = await clientFactory.findAllClients()
    
                const body = await addressFactory.generateAddressValidBody(client[0].id)
    
                const address = await addressFactory.createAddress(body)
    
                const response = await server.get(`/address/all/${client[0].id}`).set("Authorization", `Bearer ${token}`).send(body)

                const allAddress = await addressFactory.getAllClientAddress(client[0].id)
    
                expect(response.body).toEqual(allAddress);
            });
        })
    })
});
*/