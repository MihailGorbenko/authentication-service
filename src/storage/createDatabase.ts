import Database from "./database"

export default async function createDatabase(){
    const db = new Database()
    await db.connect()
    return db
}