import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
import { get_user, get_habits } from "../lib/database"
import styles from '../styles/dashboard.module.css'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'

export default function Home( { user, all_habits_list } ) {
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
  all_habits_list = JSON.parse(all_habits_list)
  const [all_habits, setAllHabits] = useState(all_habits_list)
  const all_habits_dict = {}
  all_habits_list.forEach((array, index) => {
    all_habits_dict[index] = false;
  });
  const [rowClicked, setRowClicked] = useState(all_habits_dict)
  function clickRow(index){
    if (rowClicked[index] == true){
      let copiedRowClicked = {...rowClicked};
      copiedRowClicked[index] = false
      setRowClicked( rowClicked => ({
        ...copiedRowClicked
      }));
    } else {
      let copiedRowClicked = {...rowClicked};
      copiedRowClicked[index] = true
      setRowClicked( rowClicked => ({
        ...copiedRowClicked
      }));
    }
  }

  function finishedEditing(event) {
    const index = event.target.id.replace("title", "")
    const value = event.target.value
    const input_el = document.getElementById(index + "title")
    var text = document.createElement('h4');
    text.innerText = all_habits[index].title + " "
    text.id = index + "title"
    text.style.display = 'inline'
    text.style.cursor = "pointer"
    input_el.parentNode.replaceChild(text, input_el);
    document.getElementById(index + "edit").style.display = "inline"
  }

  function clickTitle(index){
    console.log("editing")
    const title_el = document.getElementById(index + "title")
    var input = document.createElement('input');
    input.value = all_habits[index].title
    input.id = index + "title"
    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        finishedEditing(event)
      }
    });
    title_el.parentNode.replaceChild(input, title_el);
    document.getElementById(index + "edit").style.display = "none"
  }

  function deleteTitle(index){
    console.log("deleting")
    console.log(index)
  }

  const addHabitFront = async (event) => {
    if (event.key === 'Enter') {
      if (event.target.value != ""){
        console.log(event.target.value)
        fetch("/api/add_habit", {
          method: "POST",
          body: JSON.stringify({
            title: event.target.value
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
      })
      .then(response => response.json())
      .then(json => {
        if (json.success == true){
          setAllHabits(oldArray => [...oldArray, json.data]);
        } else {
          console.log(json.msg)
        }
      });
      }
    }
  };

  return (
    <Layout pageTitle="Dashboard">
      <img id="pfp" onClick={clickPfp} className={styles.pfp} src={user.image} alt="profile pic"></img>
      {pfpClicked? 
      <div className={styles.profileinfo + " glass"}>
        <p>{user.email}</p>
        <h4>Signed in as <strong>{user.name}</strong></h4>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      :<></>}
      <h2>All Habits</h2>
      {all_habits.length>=20?<></>:
      <><input type="text" placeholder="New Habit.." onKeyDown={addHabitFront}/><br/><br/></>}
      {Object.keys(all_habits).map((index) => (
        <div key={index}>
          <h4 id={index + "title"} style={{display: "inline",cursor: "pointer"}} onClick={() => clickRow(index)}>{all_habits[index].title} </h4>
          <FontAwesomeIcon id={index + "edit"} onClick={() => clickTitle(index)} icon={faPencil} style={{width: "13px", height: "13px", cursor:"pointer"}}/>&#xA0;
          <FontAwesomeIcon id={index + "delete"} onClick={() => deleteTitle(index)} icon={faTrashCan} style={{width: "13px", height: "13px", cursor:"pointer"}}/><br/>
          {rowClicked[index] == true?<p>{all_habits[index].desc}</p>:<br/>}
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
  const email = session.user.email
  const name = session.user.name
  const image = session.user.image
  const user = await get_user(email, name, image)
  const all_habits = await get_habits(email)
  return {
    props: {
        user: JSON.stringify(user),
        all_habits_list: JSON.stringify(all_habits)
    },
  }
}