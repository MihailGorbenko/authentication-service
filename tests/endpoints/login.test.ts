import chai from "chai";
import chaiHttp from 'chai-http'
import createDatabase from '../../src/storage/createDatabase'
import createApp from '../../src/app'
import Database from "../../src/storage/database";
import { Express } from "express";
import { describe } from "mocha";
import { loginBodySet } from "../testData";
import config from 'config'


let expect = chai.expect
let db: Database
let app: Express

chai.use(chaiHttp)

describe('POST /login', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })

    describe('When email and password are correct', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post('/login')
                .set('origin', 'http://localhost')
                .send({ email: `gomihagle@gmail.com`, password: `${config.get('testUserPassword')}` })
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

        it('should respond object with {accessToken} field', (done) => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.include.all.keys(['accessToken'])
            expect(res.body.accessToken).not.to.be.undefined
            done()
        })

        it('should set coockie {refreshToken}', (done) => {
            expect(res).to.have.cookie('refreshToken')
            done()
        })
    })
    describe('When password is incorrect or missing', () => {
        loginBodySet.forEach(test => {
            describe(`${test.case}`, () => {
                let res: ChaiHttp.Response
                before((done) => {
                    chai.request(app)
                        .post('/login')
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

    })

    describe('When sent wrong password', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post('/login')
                .set('origin', 'http://localhost')
                .send({ email: `gomihagle@gmail.com`, password: 'mihana' })
                .end((err, response) => {
                    res = response
                    done()
                })
        })

        it('should respond with staus code 401', (done) => {
            expect(res).to.have.status(401)
            done()
        })
        it('should respond with json', (done) => {
            expect(res).to.be.json
            done()
        })

        it('should respond object with {message, predicate} fields', (done) => {
            expect(res.body).to.be.an('object').to.has.all.keys(['message', 'predicate'])
            expect(res.body.predicate).to.match(/PASS_INCORRECT/)
            done()
        })

    })

    after((done) => {
        db.close().then(done)
    })
})
