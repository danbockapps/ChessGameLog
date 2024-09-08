import Button from '../ui/button'
import {login, signup} from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <Button formAction={login}>Log in</Button>
      <Button formAction={signup}>Sign up</Button>
    </form>
  )
}
