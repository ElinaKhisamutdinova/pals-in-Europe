import { useState } from "react";
import css from '../User.module.css';
import { userSignupAC } from '../../redux/actionCreators/userAC';
import { useDispatch } from "react-redux";
import { RootStateValue } from "../../redux/reducers/rootReducer";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export const UserSignup = () => {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errorMessage = useSelector((state: RootStateValue) => state.errorMessage);
  const history = useHistory();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(userSignupAC(name, login, email, password))
    if (errorMessage !== '') {
      history.push('/');
    }
  }

  return (
    <div>
      <form className={css.form} onSubmit={onSubmit}>
        <input
          onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setName(ev.target.value)}
          placeholder="Name"
          value={name}
        />
        <input
          onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setLogin(ev.target.value)}
          placeholder="Login"
          value={login}
        />
        <input
          onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setEmail(ev.target.value)}
          placeholder="Email"
          value={email}
        />
        <input
          onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setPassword(ev.target.value)}
          placeholder="password"
          value={password}
        />
        <button type="submit">Signup</button>
      </form>
      <div>{errorMessage}</div>
    </div>
  )
}
