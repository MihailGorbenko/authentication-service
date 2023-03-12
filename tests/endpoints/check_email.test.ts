import chai from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe } from "mocha";
import { checkEmailBodySet } from "../testData";
import config from 'config'


let expect = chai.expect
let db: Database
let app: Express

chai.use(chaiHttp)

describe('POST /checkEmail', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })

    describe('When email correct', () => {
        describe('When user with such email registred', () => {
            let res: ChaiHttp.Response
            before((done) => {
                chai.request(app)
                    .post('/checkEmail')
                    .set('origin', 'http://localhost')
                    .send({ email: `${config.get('testUserEmail')}` })
                    .end((err, response) => {
                        res = response
                        done()
                    })
            })

            it('Should respond with status code 200', (done) => {
                expect(res).to.have.status(200)
                done()
            })
            it('Should respond object with {message,predicate} fields', (done) => {
                expect(res.body).to.include.all.keys(['message', 'predicate'])
                done()
            })

            it('Should set header [Content-Type] to application/json', (done) => {
                expect(res).to.have.header("content-type", /^application\/json/)
                done()
            })
            it('Should respond object with {predicate} field match [EXIST]', (done) => {
                expect(res.body.predicate).to.match(/EXIST/)
                done()
            })

        })

        describe('When user with such email not registred', () => {
            let res: ChaiHttp.Response
            before((done) => {
                chai.request(app)
                    .post('/checkEmail')
                    .set('origin', 'http://localhost')
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
                expect(res.body).to.include.all.keys(['message', 'predicate'])
                done()
            })

            it('Should set header [Content-Type] to application/json', (done) => {
                expect(res).to.have.header("content-type", /^application\/json/)
                done()
            })
            it('Should respond object with {predicate} field match [NOT_EXIST]', (done) => {
                expect(res.body.predicate).to.match(/NOT_EXIST/)
                done()
            })
        })

    })

    describe('When email missing or incorrect', () => {
        checkEmailBodySet.forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/checkEmail')
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
