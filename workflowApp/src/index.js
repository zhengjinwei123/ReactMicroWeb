import './public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

function render(props) {
  ReactDOM.render(<App {...props}/>, document.getElementById('workflow'));
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    render({username: state.username})
  });

  render({})
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('workflow'));
}
