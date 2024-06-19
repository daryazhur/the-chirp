import { render } from '@czechitas/render';
import { fetchUser } from '../functions/fc';
import '../global.css';
import './profil.css';

const params = new URLSearchParams(window.location.search);
const userId = params.get('user');

const user = await fetchUser(userId)

document.querySelector('#root').innerHTML = render(
  <>
    <div className='user'>
      <h1>Profil uživatele - {user.name}</h1>
      <div className='info'>
        <img className='user__avatar' src={`http://localhost:4000${user.avatar}`}/>
        <p className='user__bio'>{user.bio}</p>
      </div>
    </div>
  </>
);