import { render } from '@czechitas/render';
import { Post } from '../components/Post';
import { fetchUser } from '../functions/fc';
import { fetchPosts } from '../functions/fc';
import '../global.css';
import './index.css';

const idUser = 4 // výběr uživatele s id 4
const loggedUser = await fetchUser(idUser) // definice konkrétního uživatele 
let editPost = null // do proměnné cheme schovat příspěvek přes tlačítko Edit

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

  if(editPost !== null) {
    await fetch(`http://localhost:4000/api/posts/${editPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          userName: editPost.userName,
          userId: editPost.id,
          userHandle: editPost.userHandle,
          userAvatar: editPost.userAvatar,
          text,
          likes: editPost.likes
        }
      )
    })
  } else {
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
  }
  

  window.location.reload()
})


// Kliknutí na Delete button - odstraní příspěvek
const deleteBtns = document.querySelectorAll(".delete-btn")

deleteBtns.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    const postId = e.target.dataset.id // z toho konkrétního tlačítka chci odebrat příspěvěk - id reaguje, který atribut

    await fetch(`http://localhost:4000/api/posts/${postId}`), {
      method: "DELETE" // nepracuje se s obsahem, cheme jenom mazat - stačí jenom method
    }
  })

  window.location.reload()
})


// Kliknutí na Edit - posílání požadavek na změnu příspěvku 

const editBtns = document.querySelectorAll('.edit-btn')
editBtns.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    const postId = Number(e.target.dataset.id) // převod textu do čísla

    editPost = posts.find((p) => p.id === postId)
    document.querySelector('.post-input').value = editPost.text // odchytnutí atributu text 
    document.querySelector('.post-form button').textContent = 'Upravit' // změna názvu tlačítka 
  })
})
