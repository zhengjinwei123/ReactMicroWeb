import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Hello1Page from "../pages/hello1"
import Hello2Page from "../pages/hello2"
import ErrorPage from "../pages/error"

class RouterMap extends React.Component {

    componentDidMount() {
        // console.log("componentDidMount", this.props)
    }

    componentDidUpdate() {
        console.log("RouterMap", this.props)
    }

    render() {
        return (
            <Router basename={window.__POWERED_BY_QIANKUN__ ? "/workflow" : "/"}>
                <Switch>
                    <Route path="/add" render={ props => <Hello1Page {...this.props} />}/>
                    <Route path="/mytask" render={ props => <Hello2Page  {...this.props} />}/>
                    <Route component={ErrorPage}/>
                </Switch>
            </Router>
        )
    }
}

export default RouterMap