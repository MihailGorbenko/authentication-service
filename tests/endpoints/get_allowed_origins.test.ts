import chai, { should } from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe, Test } from "mocha";
import { getOriginsBodySet } from "../testData";


let expect = chai.expect
let db: Database
let app: Express

chai.use(chaiHttp)


describe('POST /getAllowedOrigins', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })

    describe('When passed valid password', () => {
        getOriginsBodySet.validBody.forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/getAllowedOrigins')
                        .set('origin', 'http://localhost')
                        .send(test.body)
                        .end((err, response) => {
                            res = response
                            done()
                        })
                })

                it('should respond with status code 200', (done) => {
                    expect(res).to.have.status(200)
                    done()
                })

                it('should respond with json', (done) => {
                    expect(res).to.be.json
                    done()
                })
                it('should respond object with {origins} field', (done) => {
                    expect(res.body).to.be.an('object').to.has.all.keys(['origins'])
                    expect(res.body.origins).not.to.be.undefined
                    done()
                })
            })
        })

    })

    describe('When passed invalid  password', () => {
        getOriginsBodySet.invalidBody.forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/getAllowedOrigins')
                        .set('origin', 'http://localhost')
                        .send(test.body)
                        .end((err, response) => {
                            res = response
                            done()
                        })
                })
                it('should respond with status code 401', (done) => {
                    expect(res).to.have.status(401)
                    done()
                })

                it('should respond with json', (done) => {
                    expect(res).to.be.json
                    done()
                })
                it('should respond object with {message, predicate} fields', (done) => {
                    expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate'])
                    expect(res.body.predicate).to.match(/INVALID/)
                    done()
                })

            })
        })

        describe('When passed incorrect password or missing', () => {
            getOriginsBodySet.incorrectBody.forEach(test => {
                describe(`${test.case}`, () => {
                    let res: ChaiHttp.Response
                    before((done) => {
                        chai.request(app)
                            .post('/getAllowedOrigins')
                            .set('origin', 'http://localhost')
                            .send(test.body)
                            .end((err, response) => {
                                res = response
                                done()
                            })
                    })
                    it('should respond with status code 400', (done) => {
                        expect(res).to.have.status(400)
                        done()
                    })

                    it('should respond with json', (done) => {
                        expect(res).to.be.json
                        done()
                    })
                    it('should respond object with {message, predicate,errors} fields', (done) => {
                        expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate', 'errors'])
                        expect(res.body.predicate).to.match(/INCORRECT/)
                        done()
                    })

                })
            })




            after((done) => {
                db.close().then(done)
            })
        })
    })
})