import ReactDOM from 'react-dom';
// import "default-passive-events"
import App from "./App"
import * as serviceWorker from './serviceWorker';
import {GetServerRunInfo} from "./services/common"
import { registerMicroApps, start } from 'qiankun';
import {message} from "antd"
import _ from "lodash"
import "antd/dist/antd.css"
import './index.css';

const render = ({appContent, loading, language}) => {
  const container = document.getElementById('root')
  ReactDOM.render(
    <App loading={loading} content={appContent} language={language}/>,
    container
  )
}

const genActiveRule = (routerPrefix) => {
  return location => location.pathname.startsWith(routerPrefix)
}

render({loading: false, language: "", appContent: ""})

GetServerRunInfo((err, data) => {

  if (err || !data.apps) {
    message.error("无法运行,请检查服务器启动配置:" + err)
    return;
  }
  let apps = [];
  for (let i = 0; i < data.apps.length; ++i) {
    apps.push({
      name: data.apps[i].name,
      entry: data.apps[i].host,
      render: (props) => {
        render({
          ...props,
          language: data.lan
        })
      },
      activeRule: genActiveRule(`/${data.apps[i].name}`),
      props: {

      }
    })
  }
  registerMicroApps(apps)
  start();

  serviceWorker.unregister();
})

