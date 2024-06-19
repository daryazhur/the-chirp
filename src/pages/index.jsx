import { render } from '@czechitas/render';
import { Post } from '../components/Post';
import { fetchUser } from '../functions/fc';
import { fetchPosts } from '../functions/fc';
import '../global.css';
import './index.css';

const idUser = 4 // výběr uživatele s id 4
const loggedUser = await fetchUser(idUser) // definice konkrétního uživatele 

console.log(loggedUser)

const posts = await fetchPosts();

document.querySelector('#root').innerHTML = render(
  <div className="container">
    <h1>The Chirp</h1>
    <form className="post-form">
      <p>Co máte na srdci?</p>
      <textarea placeholder="Napište něco..." className="post-input"></textarea>
      <button type="submit">Publikovat</button>
    </form>
    
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  </div>
);

document.querySelector(".post-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const text = document.querySelector(".post-input").value
  const post = {
    userName: loggedUser.name,
    userId: loggedUser.id,
    userHandle: loggedUser.handle,
    userAvatar: loggedUser.avatar,
    text,
    likes: 0
  }

  await fetch("http://localhost:4000/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  })

  window.location.reload() // automaticky obnoví stránku 
})
