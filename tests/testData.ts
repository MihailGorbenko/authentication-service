import config from 'config'


export const registerBodiesSet = [

    {
        case: 'incorrect email / correct password',
        body: {
            email: 'test.incorect.email',
            password: 'correctPassword'
        },
    },
    {
        case: 'correct email / incorrect password',
        body: {
            email: 'test@email.com',
            password: 'inc'

        },
    },
    {
        case: 'incorrect email / incorrect password',
        body: {
            email: 'test.incorect.email',
            password: 'inc'
        },
    },
    {
        case: 'password key missing / email incorrect',
        body: {
            email: 'test.incorect.email',
        },
    },
    {
        case: 'email key missing / password incorrect',
        body: {
            password: 'inc',
        },
    },
    {
        case: 'password key missing / email correct',
        body: {
            email: 'test@email.com',

        },
    },
    {
        case: 'email key missing / password correct',
        body: {
            password: 'correctPassword'
        },
    },
    {
        case: 'email key missing / password key missing',
        body: {},
    },
]

export const checkEmailBodySet = [
    {
        case: 'email incorrect',
        body: {
            email: 'test.incorect.email',
        },
    },
    {
        case: 'email key missing ',
        body: {},
    },
]

export const loginBodySet = [
    {
        case: 'password is too short',
        body: {
            email: `${config.get('testUserEmail')}`,
            password: '123'
        },
    },
    {
        case: 'password is too long ',
        body: {
            email: `${config.get('testUserEmail')}`,
            password: '<script> const getUserCredentials = () => { /some hackers work/}</script>'
        },
    },
    {
        case: 'password is missing ',
        body: {
            email: `${config.get('testUserEmail')}`,
        }
    },


]

export const addOriginsBodySet = {
    validBody: [
        {
            case: 'valid credentials and origin for Dev',
            body: {
                login: 'Dev',
                password: 'devStrongPassword',
                origin: 'https://localhost:5000'
            },
        },
        {
            case: 'valid credentials and origin for Admin',
            body: {
                login: 'Admin',
                password: 'adminStrongPassword',
                origin: 'https://127.0.0.1'
            },
        },
    ],
    wrongBody: [

        {
            case: 'wrong password',
            body: {
                login: 'Admin',
                password: 'hackerPassword',
                origin: 'https://127.0.0.1'
            },
        },
    ],
    incorrectBody: [
        {
            case: 'incorrect login ',
            body: {
                login: 'Hacker',
                password: 'adminStrongPassword',
                origin: 'https://127.0.0.1'
            },
        },

        {
            case: 'password too short',
            body: {
                login: 'Admin',
                password: 'hack',
                origin: 'https://127.0.0.1'
            },
        },
        {
            case: 'password too long',
            body: {
                login: 'Admin',
                password: 'hackerPasswordhackerPasswordhackerPassword',
                origin: 'https://127.0.0.1'
            },
        },
        {
            case: 'incorrect origin',
            body: {
                login: 'Admin',
                password: 'adminStrongPassword',
                origin: 'incorrect.origin'
            },
        },
        {
            case: 'login missing',
            body: {
                password: 'adminStrongPassword',
                origin: 'https://127.0.0.1'
            },
        },
        {
            case: 'password missing',
            body: {
                login: 'Admin',
                origin: 'https://127.0.0.1'
            },
        },
        {
            case: 'origin missing',
            body: {
                login: 'Admin',
                password: 'adminStrongPassword',
            },
        },
        {
            case: 'empty body',
            body: {}
        },
    ]
}


export const getOriginsBodySet = {

    validBody: [
        {
            case: 'valid credentials for Dev',
            body: {
                login: 'Dev',
                password: 'devStrongPassword',
            },
        },
        {
            case: 'valid credentials for Admin',
            body: {
                login: 'Admin',
                password: 'adminStrongPassword',
            },
        },

    ],
    invalidBody: [
        {
            case: 'invalid password for Dev',
            body: {
                login: 'Dev',
                password: 'hackerPassword',
            },
        }, {
            case: 'invalid password for Admin',
            body: {
                login: 'Admin',
                password: 'hackerPassword',
            },
        },


    ],
    incorrectBody: [
        {
            case: 'incorrect login ',
            body: {
                login: 'Hacker',
                password: 'adminStrongPassword',
            },
        },

        {
            case: 'password too short',
            body: {
                login: 'Admin',
                password: 'hack',
            },
        },
        {
            case: 'password too long',
            body: {
                login: 'Admin',
                password: 'hackerPasswordhackerPasswordhackerPassword',
            },
        },

        {
            case: 'login missing',
            body: {
                password: 'adminStrongPassword',
            },
        },
        {
            case: 'password missing',
            body: {
                login: 'Admin',
            },
        },
        {
            case: 'empty body',
            body: {}
        },
    ]
}


export function getSetPasswordBodyData(token:String) {

    return [
        {
            case: 'password too short',
            body: {
                password: 'pas',
                token
            },
        },
        {
            case: 'password too long',
            body: {
                password: 'hackerPasswordhackerPasswordhackerPassword',
                token
            },
        },

        {
            case: 'token missing',
            body: {
                password: 'StrongPassword',
            },
        },
        {
            case: 'password missing',
            body: {
                token
            },
        },
        {
            case: 'empty body',
            body: {}
        },
    ]
}