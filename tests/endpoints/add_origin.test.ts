import chai, { should } from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe, Test } from "mocha";
import { addOriginsBodySet, loginBodySet } from "../testData";


let expect = chai.expect
let db: Database
let app: Express

chai.use(chaiHttp)

function getRandomOrigin() {
    return `https://${(Math.floor(Math.random() * 255) + 1)}.${(Math.floor(Math.random() * 255) + 1)}.${(Math.floor(Math.random() * 255) + 1)}.${(Math.floor(Math.random() * 255) + 1)}`
}

describe('POST /addOrigin', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })
    describe('When passed correct login, password and origin', () => {

        describe('When such origin not exists', () => {
            addOriginsBodySet.validBody.forEach(test => {
                const body = Object.assign({}, test.body)
                body.origin = getRandomOrigin()

                describe(`${test.case}`, () => {
                    let res: ChaiHttp.Response
                    before((done) => {
                        chai.request(app)
                            .post('/addOrigin')
                            .set('origin', 'http://localhost')
                            .send(body)
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
                    it('should respond object with {message, predicate,secret} fields', (done) => {
                        expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate','secret'])
                        expect(res.body.secret).not.to.be.undefined
                        expect(res.body.predicate).to.match(/SUCCESS/)
                        done()
                    })
                })
            })


        })

        describe('When such origin already exists', () => {
            addOriginsBodySet.validBody.forEach(test => {

                describe(`${test.case}`, () => {

                    let res: ChaiHttp.Response
                    before((done) => {
                        const body = Object.assign({}, test.body)
                        body.origin = getRandomOrigin()

                        chai.request(app)
                            .post('/addOrigin')
                            .set('origin', 'http://localhost')
                            .send(body)
                            .end((err, resp) => {

                                chai.request(app)
                                    .post('/addOrigin')
                                    .set('origin', 'http://localhost')
                                    .send(body)
                                    .end((err, response) => {
                                        res = response
                                        done()
                                    })
                            })
                    })

                    it('should respond with status code 507', (done) => {
                        expect(res).to.have.status(507)
                        done()
                    })

                    it('should respond with json', (done) => {
                        expect(res).to.be.json
                        done()
                    })
                    it('should respond object with {message} fields', (done) => {
                        expect(res.body).to.be.an('object').to.has.all.keys(['message'])
                        done()
                    })
                })
            })


        })

    })

    describe('When passed wrong  password', () => {
        addOriginsBodySet.wrongBody.forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/addOrigin')
                        .set('origin', 'http://localhost')
                        .send(test.body)
                        .end((err, response) => {
                            console.log(response.body);
                            
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
                it('should respond object with {message,predicate} fields', (done) => {
                    expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate'])
                    expect(res.body.predicate).to.match(/INVALID/)
                    done()
                })

            })
        })

    })

    describe('When passed incorrect login, password  or origin', () => {
        addOriginsBodySet.incorrectBody.forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/addOrigin')
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
                it('should respond object with {message,predicate,errors} fields', (done) => {
                    expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate', 'errors'])
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