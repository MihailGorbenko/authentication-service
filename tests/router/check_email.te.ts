import mongoose from 'mongoose'
import  request from 'supertest'
import  app from '../../src/app'
import config  from 'config'
import { beforeEach, afterEach, describe, it } from 'node:test'


beforeEach(async() => {
   mongoose.connect(config.get('mongoUri'))
})

afterEach(async() => {
 mongoose.connection.close()
})

describe('POST /checkEmail',() => {
    test('should return status code 200 if email registred, otherwise 400',async() => {
        const res = await request(app).post('/checkEmail')
        expect(res.statusCode).toBe(400);
       // expect(res.body.length).toBeGreaterThan(0)

    })
})


