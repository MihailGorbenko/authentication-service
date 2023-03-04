import { randomUUID } from 'crypto'
import httpServer from '../../src/server'
import supertest from 'supertest'


let request: supertest.SuperAgentTest
jest.setTimeout(20000)

beforeAll(async () => {
    request = supertest.agent(httpServer)
})

afterAll((done) => {
    httpServer.close(done)
})


describe('POST /register', () => {


    describe("when passed an email and password", () => {

        test('should respond with status code 200', async () => {
            const email = randomUUID().toString().slice(0, 8)
            const res = await request
                .post('/register')
                .send({
                    email: `${email}@gmail.com`,
                    password: '1234345'
                })

            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(res.status).toBe(200)
            expect(res.body.message).toBeDefined()
            expect(res.body.userId).toBeDefined()
        })

    })


    describe("when email or password is missing", () => {

        test('', () => {

            const email = randomUUID().toString().slice(0, 8)
            const bodies = [
                { password: '1234345' },
                { email: `${email}@gmail.com`, }
            ]

            bodies.forEach(async (body) => {
                const res = await request
                    .post('/register')
                    .send({ body })

                expect(res.statusCode).toBe(400)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(res.body.message).toBeDefined()
                expect(res.body.predicate).toEqual(expect.stringContaining('INCORRECT'))
            })

        })
    })




    describe("when user with such email already exists", () => {
        test('', async () => {

            const res = await request
                .post('/register')
                .send({
                    email: `gomihagle@gmail.com`,
                    password: '1234345'
                })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBeDefined()
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(res.body.predicate).toEqual(expect.stringContaining('EXIST'))
        })

    })



    describe("when email or password invalid", () => {

        test('', () => {

            const email = randomUUID().toString().slice(0, 8)
            const bodies = [
                { email: `${email}@gmail.com`, password: '1' }, //WEAK PASSWORD: LEN < 5
                { email: `${email}$gmail.com`, password: '1234345' } //TYPO IN EMAIL
            ]

            bodies.forEach(async (body) => {
                const res = await request
                    .post('/register')
                    .send({ body })

                expect(res.statusCode).toBe(400)
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(res.body.message).toBeDefined()
                expect(res.body.predicate).toEqual(expect.stringContaining('INCORRECT'))
            })

        })
    })
})
