import React, {Suspense} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Canvas from './Canvas'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {RecoilRoot} from 'recoil'
import Atoms from './examples/Atoms'
import Selectors from './examples/Selectors'
import Async from './examples/Async'
import {AtomEffects} from './examples/AtomEffect'

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider>
        <Router>
          <Switch>
            <Route exact path="/">
              <Canvas />
            </Route>
            <Route exact path="/exam/atomeffects">
              <Suspense fallback={<div>Loading</div>}>
                <AtomEffects />
              </Suspense>
            </Route>
            <Route path="/exam/selectors">
              <Selectors />
            </Route>
            <Route path="/exam/atoms">
              <Atoms />
            </Route>
            <Route path="/exam/async">
              <Async />
            </Route>
          </Switch>
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
)
