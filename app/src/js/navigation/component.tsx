import { getKernel } from '@code-202/kernel'
import { useLocation, useNavigate } from 'react-router'
import { Navigator } from './navigator'

export default function Component () {
    const navigator: Navigator = getKernel().container.get('navigator') as Navigator

    navigator.location = useLocation()
    navigator.navigate = useNavigate()

    return null
}
