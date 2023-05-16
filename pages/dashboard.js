import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
import { get_user } from "../lib/database"
import styles from '../styles/dashboard.module.css'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'cookies'

export default function Home( { user } ) {
  // var all_todos_list = "[]"
  user = JSON.parse(user)
  const [pfpClicked, setPfpClicked] = useState(false)
  function clickPfp(){
    if (pfpClicked == false){
      document.getElementById("pfp").classList.add(styles.pfpclick);
      setPfpClicked(true)
    } else {
      document.getElementById("pfp").classList.remove(styles.pfpclick);
      setPfpClicked(false)
    }
  }
  const all_todos_list = user.todo
  const [all_todos, setAlltodos] = useState(all_todos_list)

  function finishedEditing(event) {
    const index = event.target.id.replace("title", "")
    const value = event.target.value
    document.getElementById(index + "edit").style.display = "inline"
    document.getElementById(index + "check").style.display = "inline"
    const input_el = document.getElementById(index + "title")
    var text = document.createElement('h4');
    if (value != all_todos[index].title){
      text.innerHTML = value + " "
      fetch("/api/edit_todo", {
        method: "POST",
        body: JSON.stringify({
          oldTitle: all_todos[index].title,
          newTitle: value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(json => {
        if (json.success == true){
          setAlltodos(json.data);
        } else {
          console.log(json.msg)
        }
      });
    } else {
      text.innerText = all_todos[index].title + " "
    }
    text.id = index + "title"
    text.style.display = 'inline'
    text.style.cursor = "pointer"
    text.style.textDecoration = all_todos[index].done ? "line-through" : "none"
    input_el.parentNode.replaceChild(text, input_el);
  }

  function clickTitle(index){
    const title_el = document.getElementById(index + "title")
    var input = document.createElement('input');
    input.value = all_todos[index].title
    input.id = index + "title"
    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        finishedEditing(event)
      }
    });
    title_el.parentNode.replaceChild(input, title_el);
    document.getElementById(index + "edit").style.display = "none"
    document.getElementById(index + "check").style.display = "none"
  }

  function deleteTodo(title){
    fetch("/api/delete_todo", {
      method: "POST",
      body: JSON.stringify({
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.success == true){
        setAlltodos(json.data);
      } else {
        console.log(json.msg)
      }
    });
  }

  const addtodoFront = (event) => {
    if (event.key === 'Enter') {
      if (event.target.value != ""){
        const title = event.target.value
        fetch("/api/add_todo", {
          method: "POST",
          body: JSON.stringify({
            title: title,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then(response => response.json())
        .then(json => {
          if (json.success == true){
            setAlltodos(json.data);
            event.target.value = ""
          } else {
            console.log(json.msg)
          }
        });
      }
    }
  };

  function checkboxClick(index) {
    console.log(index)
    const newStatus = document.getElementById(index + "checkbox").checked
    const title = all_todos[index].title
    fetch("/api/change_todo_status", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        newStatus: newStatus
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.success == true){
        setAlltodos(json.data);
      } else {
        console.log(json.msg)
      }
    });
  }

  return (
    <Layout pageTitle="Dashboard">
      <img id="pfp" onClick={clickPfp} className={styles.pfp} src={user.image} alt="profile pic"></img>
      {pfpClicked? 
      <div className={styles.profileinfo + " glass"}>
        <h4>Signed in as <strong>{user.username}</strong></h4>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      :<></>}
      <h2>All todos</h2>
      {all_todos.length>=20?<></>:
      <><input type="text" placeholder="New todo.." onKeyDown={addtodoFront}/><br/><br/></>}
      {Object.keys(all_todos).map((index) => (
        <div key={index} className={all_todos[index].done ? "fontdarker" : ""}>
          <label id={index + "check"}><input checked={all_todos[index].done} id={index + "checkbox"} type='checkbox' onClick={() => checkboxClick(index)}/></label>
          <h4 id={index + "title"} style={{display: "inline",cursor: "pointer", textDecoration: all_todos[index].done ? "line-through" : "none"}}>{all_todos[index].title} </h4>
          <FontAwesomeIcon id={index + "edit"} onClick={() => clickTitle(index)} icon={faPencil} style={{width: "13px", height: "13px", cursor:"pointer"}}/>&#xA0;
          <FontAwesomeIcon id={index + "delete"} onClick={() => deleteTodo(all_todos[index].title)} icon={faTrashCan} style={{width: "13px", height: "13px", cursor:"pointer"}}/><br/><br/>
        </div>
      ))}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const image = session.user.image
  var username;
  var userId = session.user.image.split("/u/")[1]
  userId = userId.split("?v=")[0]
  const cookies = new Cookies(context.req, context.res)
  if (cookies.get("Username")){
    username = cookies.get("Username")
  } else {
    const resp = await fetch(
      `https://api.github.com/user/${userId}`
    );
    const data = await resp.json();
    username = data['login']
    cookies.set('Username', username)
  }
  const user = await get_user(username, image)
  return {
    props: {
        user: JSON.stringify(user),
    },
  }
}