import React from "react"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"

import { connect } from "react-redux"
import { bindActionCreators } from "redux";
import * as userinfoActions from "../actions/userinfo.js";

import Layout from "../components/layout/index.jsx";
import ErrorPage from "../pages/error/index.jsx"
import DashboardPage from "../pages/dashboard/index.jsx"
import LoginPage from "../pages/login/index.jsx"
import AccountMgrPage from "../pages/accountMgr/index"

class MyRouter extends React.Component {

    render() {
        return (
            <>
             <Route { ...this.props } />
            </> 
        )
    }
}

class RouterMap extends React.Component {

    render() {
        const layoutRouter = (
            <Layout userinfoActions={ this.props.userinfoActions }
                    userinfo={ this.props.userinfo }
                    loading={ this.props.loading}
                    content={ this.props.content }>
                <Switch>
                    <Route path="/dashboard" component={DashboardPage}/>
                    <Route path="/sys_mgr/account_mgr" component={AccountMgrPage}/>
                    <Route component={ErrorPage}/>
                </Switch>
            </Layout>
        )

        return (
            <Router>
                <Switch>
                    <Route path="/login">
                        <LoginPage userinfoActions={ this.props.userinfoActions } userinfo={ this.props.userinfo }/>
                    </Route>
                    <MyRouter path="/" render={ props => layoutRouter }/>
                </Switch>
            </Router>
        )
    }
}

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userinfoActions: bindActionCreators(userinfoActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RouterMap)