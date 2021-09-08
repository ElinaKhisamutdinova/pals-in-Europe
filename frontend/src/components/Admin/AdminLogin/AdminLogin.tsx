import { useState } from "react"
import css from './Admin.module.css';
import { adminLoginAC } from '../../redux/actionCreators/adminAC';
import { useDispatch } from "react-redux";

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const dispatch = useDispatch();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(adminLoginAC(login, password))
  }

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <input
        onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setLogin(ev.target.value)}
        placeholder="Login"
        value={login}
      />
      <input
        onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setPassword(ev.target.value)}
        placeholder="password"
        value={password}
      />
      <button type="submit">Login</button>
    </form>
  )
}