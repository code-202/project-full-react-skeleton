import * as React from 'react'
import { Routes, Route, Outlet, Link } from 'react-router-dom'
import loadable from '@loadable/component'
import { LoadingScreen } from '@code-202/loader'

const fallback = <LoadingScreen size="xl"/>

const Home = loadable(() => import('./home'), {fallback})
const About = loadable(() => import('./about'), {fallback})

interface Props {}

interface State {}

export default class Layout extends React.PureComponent<Props, State> {
    render () {
        return (
            <Routes>
                <Route path="/" element={<Layout2 />} >
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Route>
            </Routes>
        )
    }
}

function Layout2() {
  return (
    <div>
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>

        <hr />

        <Outlet />
    </div>
  );
}
