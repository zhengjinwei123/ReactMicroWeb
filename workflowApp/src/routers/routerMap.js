import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Hello1Page from "../pages/hello1"
import Hello2Page from "../pages/hello2"
import ErrorPage from "../pages/error"


class RouterMap extends React.Component {
    render() {
        return (
            <Router basename={window.__POWERED_BY_QIANKUN__ ? "/workflow" : "/"}>
                <Switch>
                    <Route path="/add" component={Hello1Page}/>
                    <Route path="/mytask" component={Hello2Page}/>
                    <Route component={ErrorPage}/>
                </Switch>
            </Router>
        )
    }
}

export default RouterMap