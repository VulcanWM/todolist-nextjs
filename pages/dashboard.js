import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
// import { get_user, get_habits } from "../lib/database"
import { get_user } from "../lib/database"
import styles from '../styles/dashboard.module.css'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'

export default function Home( { user, all_habits } ) {
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

  all_habits = JSON.parse(all_habits)
  const all_habits_dict = {}
  all_habits.forEach((array, index) => {
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
  function clickTitle(index){
    console.log("editing")
    console.log(index)
  }

  function deleteTitle(index){
    console.log("deleting")
    console.log(index)
  }

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
      {Object.keys(all_habits).map((index) => (
        <div key={index}>
          <h4 style={{display: "inline",cursor: "pointer"}} onClick={() => clickRow(index)}>{all_habits[index].title} </h4>
          <FontAwesomeIcon onClick={() => clickTitle(index)} icon={faPencil} style={{width: "13px", height: "13px", cursor:"pointer"}}/>&#xA0;
          <FontAwesomeIcon onClick={() => deleteTitle(index)} icon={faTrashCan} style={{width: "13px", height: "13px", cursor:"pointer"}}/><br/>
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
  console.log(session)
  const email = session.user.email
  const name = session.user.name
  const image = session.user.image
  const user = await get_user(email, name, image)
  console.log(user)
  // const all_habits = {"Title": "Description",
  //  "Title 2": "this a random long piece of text yes very long it is even more longer now ha",
  // "Another Big Long Title": "woah"}
  const all_habits = [
    {"title": "Title", "desc": "Description", "active": true},
    {"title": "Title 2", "desc": "this a random long piece of text yes very long it is even more longer now ha", "active": false},
    {"title": "Another Big Long Title", "desc": "woah", "active": true}
  ]
  console.log(all_habits)
  // const all_habits = await get_habits(email)
  return {
    props: {
        user: JSON.stringify(user),
        all_habits: JSON.stringify(all_habits)
    },
  }
}