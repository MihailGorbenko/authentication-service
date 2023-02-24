export default class Log {
    methodName:string = ''

    constructor(methodName:string = ''){
        this.methodName = methodName
    }

    error(subject:string){
        console.error(`[-SERVER ERROR-] in (${this.methodName}):: ${subject}`)
    }

    info(subject:string){
        console.log(`[-SERVER INFO-] from (${this.methodName}):: ${subject}`)
    }

    log(subject:string) {
        console.log(subject)
        
    }

}
