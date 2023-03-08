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