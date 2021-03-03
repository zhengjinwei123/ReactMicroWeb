import ReactDOM from 'react-dom';
import App from "./App"
import * as serviceWorker from './serviceWorker';

import { registerMicroApps, start } from 'qiankun';

import "antd/dist/antd.css"
import './index.css';

const render = ({appContent, loading}) => {
  const container = document.getElementById('root')

  ReactDOM.render(
    <App loading={loading} content={appContent} />,
    container
  )
}

render({loading: false })

const genActiveRule = (routerPrefix) => {
  return location => location.pathname.startsWith(routerPrefix)
}

registerMicroApps([
  { name: "workflow", entry: "//localhost:9004", render, activeRule: genActiveRule("/workflow")}
])


start();

serviceWorker.unregister();
