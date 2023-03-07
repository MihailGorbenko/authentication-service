import http from 'http'
import app from '../../src/app'
import config from 'config'
import supertest from 'supertest'
import Database, { DB } from '../../src/storage/database'
import createApp from '../../src/app'
import { createHttpServer } from '../../src/server'
import { randomUUID } from 'crypto'
import createDatabase from '../../src/storage/createDatabase'


let request: supertest.SuperAgentTest
let httpServer: http.Server
let db: Database
jest.setTimeout(20000)


beforeAll(async () => {
    db = await createDatabase()
    const app = createApp(db)
    request = supertest.agent(app)
})

afterAll(async() => {
    db.close()
})

describe('POST /checkEmail', () => {

    describe('when user not registred', () => {
        let res: any
        beforeAll(async () => {
            const email = randomUUID().toString().slice(0, 8)
            res = await request
                .post('/checkEmail')
                .send({
                    email: `${email}@gmail.com`,
                })
        })
        test('should respond with status code 401',() => {
            expect(res.status).toBe(401)
        })

       
    })

    describe('when user  registred', () => {
        let res: any
        beforeAll(async () => {
            res = await request
                .post('/checkEmail')
                .send({
                    email: `gomihagle@gmail.com`,
                })
        })
        test('should respond with status code 200',() => {
            expect(res.status).toBe(200)
        })

    })

})


