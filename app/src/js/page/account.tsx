import loadable from '@loadable/component'
import { Loader } from '../component'

export const Account = loadable(() => import(`../account/home`), {
    fallback: <Loader />
})
