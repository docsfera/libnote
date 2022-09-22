import {buildSchema} from "graphql"

const schema = buildSchema(`
    type User {
        id: ID
        username: String
        
    
    }

`)

export {schema}