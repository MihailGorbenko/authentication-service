import chai from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe } from "mocha";
import { registerBodiesSet } from "../testData";

let expect = chai.expect
let db: Database
let app: Express

chai.use(chaiHttp)

describe('POST /register', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })

    describe('When passed correct email and password ', () => {

        describe('When user with such email not exist', () => {
            let res: ChaiHttp.Response
            before((done) => {
                chai.request(app)
                    .post('/register')
                    .set('origin', 'http://localhost')
                    .send({ email: `${crypto.randomUUID()}@gmail.com`, password: 'sdsdsds' })
                    .end((err, response) => {
                        res = response
                        done()
                    })
            })

            it('Should respond with status code 200', (done) => {
                expect(res).to.have.status(200)
                done()
            })
            it('Should respond with object with {userId} field', (done) => {
                expect(res.body).to.be.a('object')
                expect(res.body).to.include.all.keys(['message', 'userId'])
                expect(res.body.userId).not.to.be.undefined
                done()
            })

            it('Should set header [Content-Type] to application/json', (done) => {
                expect(res).to.have.header("content-type", /^application\/json/)
                done()
            })
        })

        describe('When user with such email exist', () => {
            let res: ChaiHttp.Response
            before((done) => {
                chai.request(app)
                    .post('/register')
                    .set('origin', 'http://localhost')
                    .send({ email: `gomihagle@gmail.com`, password: 'sdsdsds' })
                    .end((err, response) => {
                        res = response
                        done()
                    })
            })

            it('Should respond with status code 400', (done) => {
                expect(res).to.have.status(400)
                done()
            })

            it('Should respond object with {message, predicate} fields', (done) => {
                expect(res.body).to.be.a('object')
                expect(res.body).to.include.all.keys(['message', 'predicate'])
                expect(res.body.predicate).to.match(/EXIST/)
                done()
            })

            it('Should set header [Content-Type] to application/json', (done) => {
                expect(res).to.have.header("content-type", /^application\/json/)
                done()
            })
        })

    })

    describe('When passed incorrect email or/and password, or missing', () => {
        registerBodiesSet.forEach((test) => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/register')
                        .set('origin', 'http://localhost')
                        .send(test.body)
                        .end((err, response) => {
                            res = response
                            done()
                        })
                })

                it('Should respond with status code 400', (done) => {
                    expect(res).to.have.status(400)
                    done()
                })

                it('Should respond object with {message,predicate,errors} fields', (done) => {
                    expect(res.body).to.include.all.keys(['message', 'predicate', 'errors'])
                    done()
                })

                it('Should set header [Content-Type] to application/json', (done) => {
                    expect(res).to.have.header("content-type", /^application\/json/)
                    done()
                })
                it('Should respond object with {predicate} field match [INCORRECT]', (done) => {
                    expect(res.body.predicate).to.match(/INCORRECT/)
                    done()
                })
            })

        })
    })

    after((done) => {
        db.close().then(done)
    })
})


