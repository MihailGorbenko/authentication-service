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
let RPToken: String

chai.use(chaiHttp)

describe('POST /resetPasswordLink/:token', () => {
    before(async () => {
        db = await createDatabase()
        const token = await db.createNewRPToken(config.get('testUID'), 'https://test.com') //NEEDS USER WITH SUCH ID TO EXIST 
        RPToken = token?.token!
        app = createApp(db)
    })

    describe('When token is valid', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post(`/resetPasswordLink/${RPToken}`)
                .redirects(0)
                .end((err, response) => {
                    res = response
                    done()
                })
        })

        it('Should respond with status code 302', (done) => {
            expect(res).to.have.status(302)
            done()
        })
        it('Should redirect to client resetPassword route', (done) => {
            expect(res).to.redirectTo(`https://test.com${config.get('resetPasswordClientUrl')}/${RPToken}`)
            done()
        })


    })

    describe('When token not valid or expired', () => {
        let res: ChaiHttp.Response
        before((done) => {
            chai.request(app)
                .post(`/resetPasswordLink/${crypto.randomUUID()}`)
                .redirects(0)
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



    after((done) => {
        db.close().then(done)
    })

})


