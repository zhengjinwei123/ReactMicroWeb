import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import AddTaskPage from "../pages/AddTask"
import MyTaskPage from "../pages/MyTask/index.jsx"
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
                    <Route path="/add" render={ props => <AddTaskPage {...this.props} />}/>
                    <Route path="/mytask" render={ props => <MyTaskPage  {...this.props} />}/>
                    <Route component={ErrorPage}/>
                </Switch>
            </Router>
        )
    }
}

export default RouterMap