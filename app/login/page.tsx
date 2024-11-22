import {FC} from 'react'
import LoginSignup from '../ui/loginSignup'
import {login} from './actions'

const LoginPage: FC = () => <LoginSignup buttonText="Log in" onSubmit={login} />
export default LoginPage
