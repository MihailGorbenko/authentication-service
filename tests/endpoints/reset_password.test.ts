import chai from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe } from "mocha";
import config from 'config'


let expect = chai.expect
let db: Database
let app: Express

chai.use(chaiHttp)

describe('POST /resetPassword', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })

    describe('When user with such email registred', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post('/resetPassword')
                .send({ email: `${config.get('testUserEmail')}` })
                .set('Origin','https://test.com')
                .end((err, response) => {
                    res = response
                    done()
                })
        })

        it('Should respond with status code 200', (done) => {
            expect(res).to.have.status(200)
            done()
        })
        it('Should respond object with {message} field', (done) => {
            expect(res).to.be.json
            expect(res.body).to.include.all.keys(['message'])
            expect(res.body.message).not.to.be.undefined
            done()
        })


    })

    describe('When user with such email not registred', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post('/resetPassword')
                .send({ email: `${crypto.randomUUID()}@gmail.com` })
                .end((err, response) => {
                    res = response
                    done()
                })
        })

        it('Should respond with status code 401', (done) => {
            expect(res).to.have.status(401)
            done()
        })
        it('Should respond object with {message,predicate} fields', (done) => {
            expect(res).to.be.json
            expect(res.body).to.include.all.keys(['message', 'predicate'])
            done()
        })

        it('Should respond object with {predicate} field match [NOT_EXIST]', (done) => {
            expect(res.body.predicate).to.match(/NOT_EXIST/)
            done()
        })



    })

    after((done) => {
        db.close().then(done)
    })
})
