import loadable from '@loadable/component'
import { Loader } from '../component'

export const Demo = loadable(() => import(`../demo/home`), {
    fallback: <Loader />
})
