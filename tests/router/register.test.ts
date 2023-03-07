import { randomUUID } from 'crypto'
import supertest from 'supertest'
import Database, { DB } from '../../src/storage/database'
import http from 'http'
import createApp from '../../src/app'
import createDatabase from '../../src/storage/createDatabase'

let request: supertest.SuperAgentTest
jest.setTimeout(20000)

let httpServer: http.Server
let db: Database

beforeAll(async () => {
    db = await createDatabase()
    const app = createApp(db)
    request = supertest.agent(app)
})

afterAll((done) => {
      db.close().then(done())
})


describe('POST /register', () => {

    describe("when passed correct an email and password", () => {

        describe("when user with such email not exists", () => {
            let res: any

            beforeAll(async () => {
                const email = randomUUID().toString().slice(0, 8)
                res = await request
                    .post('/register')
                    .send({
                        email: `${email}@gmail.com`,
                        password: '1234345'
                    })

            })

            test('should respond with status code 200', async () => {
                expect(res.status).toBe(200)
            })

            test('should set header "Content-Type" to json', async () => {
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
            })

            test('should respond an object with defined {message} and {userId} fields ', async () => {
                expect(res.body.message).toBeDefined()
                expect(res.body.userId).toBeDefined()
            })
        })

        describe("when user with such email already exists", () => {
            let res: any
            beforeAll(async () => {
                res = await request
                    .post('/register')
                    .send({
                        email: `gomihagle@gmail.com`,
                        password: '1234345'
                    })
            })

            test('should resppond with status code 400', () => {
                expect(res.statusCode).toBe(400)
            })

            test('should set header "Content-Type" to json', () => {
                expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
            })
            test('should respond object with {message} and {predicate} fields', () => {
                expect(res.body.message).toBeDefined()
                expect(res.body.predicate).toBeDefined()
            })
            test('{predicate} field os response object must contain "EXIST" value', () => {
                expect(res.body.predicate).toEqual(expect.stringContaining('EXIST'))
            })

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
