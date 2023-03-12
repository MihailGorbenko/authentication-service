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

describe('POST /refreshToken', () => {
    before(async () => {
        db = await createDatabase()
        app = createApp(db)
    })

    describe('When user are logged in', () => {
        let loginRes: ChaiHttp.Response
        let loginCookie: String
        let refreshResponce: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post('/login')
                .send({
                    email: `${config.get('testUserEmail')}`,
                    password: `${config.get('testUserPassword')}`
                })
                .end((err, res) => {
                    loginRes = res
                    loginCookie =
                        res.header['set-cookie'][0].split(';')[0]

                    chai.request(app)
                        .post('/refreshToken')
                        .set('Cookie', `${loginCookie}`)
                        .end((err, res) => {
                            refreshResponce = res
                            done()
                        })

                })
        })
        it('should respond with status code 200', (done) => {
            expect(refreshResponce).to.have.status(200)
            done()
        })

        it('should respond with json', (done) => {
            expect(refreshResponce).to.be.json
            done()
        })

        it('should respond object with {accessToken} field', (done) => {
            expect(refreshResponce.body).to.be.an('object')
            expect(refreshResponce.body).to.include.all.keys(['accessToken'])
            expect(refreshResponce.body.accessToken).not.to.be.undefined
            done()
        })

        it('should set coockie {refreshToken}', (done) => {
            expect(refreshResponce).to.have.cookie('refreshToken')
            done()
        })

    })


    describe('When wrong/expired refresh token  ',() => {
        let res:ChaiHttp.Response
        before((done) => {
            chai.request(app)
            .post('/refreshToken')
            .set('Cookie', `refreshToken=${crypto.randomUUID()}`)
            .end((err, response) => {
                res = response
                done()
            })
        })

        it('should respond with status code 401', (done) => {
            expect(res).to.have.status(401)
            done()
        })
        it('should respond with json',(done) => {
            expect(res).to.be.json
            done()
        })
        it('should respond with object with {message,predicate} fields',(done) => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys(['message','predicate'])
            expect(res.body.predicate).to.match(/BAD_TOKEN/)
            done()
        })
    })

    describe('When refresh token is missing ',() => {
        let res:ChaiHttp.Response
        before((done) => {
            chai.request(app)
            .post('/refreshToken')
            .end((err, response) => {
                res = response
                done()
            })
        })

        it('should respond with status code 400', (done) => {
            expect(res).to.have.status(400)
            done()
        })
        it('should respond with json',(done) => {
            expect(res).to.be.json
            done()
        })
        it('should respond with object with {message,predicate} fields',(done) => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys(['message','predicate'])
            expect(res.body.predicate).to.match(/MISSING_TOKEN/)
            done()
        })
    })


    after((done) => {
        db.close().then(done)
    })
})