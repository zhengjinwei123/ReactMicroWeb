
import React from "react"
import RouterMap from "./routers/routerMap"

const AppFrameWork = (props) => {

  return (
    <>
      <div id="zjw-loging-container"></div>
      <RouterMap {...props}/>
    </>
  )
}

export default AppFrameWork
