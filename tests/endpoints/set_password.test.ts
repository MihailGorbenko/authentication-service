import chai from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe } from "mocha";
import config from 'config'
import { getSetPasswordBodyData } from "../testData";



let expect = chai.expect
let db: Database
let app: Express
let RPToken: String

chai.use(chaiHttp)

describe('POST /setPassword', () => {
    before(async () => {
        db = await createDatabase()
        const token = await db.createNewRPToken(config.get('testUID'), 'https://test.com') //NEEDS USER WITH SUCH ID TO EXIST 
        RPToken = token?.token!
        app = createApp(db)
    })

    describe('When token valid', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post(`/setPassword`)
                .set('origin', 'http://localhost')
                .send({
                    password: `${config.get('testUserPassword')}`,
                    token: RPToken
                })
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
            expect(res.body).to.have.all.keys(['message'])
            done()
        })
    })

    describe('When token invalid or expired', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post(`/setPassword`)
                .set('origin', 'http://localhost')
                .send({
                    password: `${config.get('testUserPassword')}`,
                    token: crypto.randomUUID()
                })
                .end((err, response) => {
                    res = response
                    done()
                })
        })

        it('Should respond with status code 400', (done) => {
            expect(res).to.have.status(400)
            done()
        })
        it('should respond with json', (done) => {
            expect(res).to.be.json
            done()
        })
        it('should respond object with {message, predicate} fields', (done) => {
            expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate'])
            expect(res.body.predicate).to.match(/TOKEN_EXP/)
            done()
        })

    })

    describe('When token or/and password incorrect', () => {
        getSetPasswordBodyData(RPToken).forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post(`/setPassword`)
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
    })




    after((done) => {
        db.close().then(done)
    })

})