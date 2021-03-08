// import { FormattedMessage  } from 'react-intl'
import {postApi} from "../utils/util"
import {useEffect} from "react"

const Hello1 = ({username}) => {

    useEffect(() =>{
        postApi("http://localhost:8801/api/test", {}, (err, data) => {
            console.log("hello1 call:", err, data)
        })
    }, [])

    return (
        <div>hello1: {username}</div>
    )
}

export default Hello1