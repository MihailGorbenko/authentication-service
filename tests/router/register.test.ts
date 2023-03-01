import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../src/app'
import config from 'config'
import { randomUUID } from 'crypto'


beforeAll(async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.get('mongoUri'))

})

afterAll(async () => {
    await mongoose.connection.close()
})
describe('POST /register', () => {

    describe("when passed an email and password", () => {
        //should create user in database with email and password

        test('should respond with status code 200', async () => {
            const email = randomUUID().toString().slice(0, 8)
            const res = await request(app)
                .post('/register')
                .send({
                    email: `${email}@gmail.com`,
                    password: '1234345'
                })

            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(res.status).toBe(200)
            expect(res.body.message).toBeDefined()
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
            const res = await request(app)
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

        const res = await request(app)
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
            const res = await request(app)
                .post('/register')
                .send({ body })

            expect(res.statusCode).toBe(400)
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
            expect(res.body.message).toBeDefined()
            expect(res.body.predicate).toEqual(expect.stringContaining('INCORRECT'))
        })

    })
})

