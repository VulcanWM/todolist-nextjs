import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
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
  const [rowClicked, setRowClicked] = useState(all_habits)
  function clickRow(title){
    if (rowClicked[title] == true){
      let copiedRowClicked = {...rowClicked};
      copiedRowClicked[title] = false
      setRowClicked( rowClicked => ({
        ...copiedRowClicked
      }));
    } else {
      let copiedRowClicked = {...rowClicked};
      copiedRowClicked[title] = true
      setRowClicked( rowClicked => ({
        ...copiedRowClicked
      }));
    }
  }
  function clickTitle(title){
    console.log("editing")
    console.log(title)
  }

  function deleteTitle(title){
    console.log("deleting")
    console.log(title)
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
      {Object.keys(all_habits).map((title, index) => (
        <div key={index}>
          <h4 style={{display: "inline",cursor: "pointer"}} onClick={() => clickRow(title)}>{title} </h4>
          <FontAwesomeIcon onClick={() => clickTitle(title)} icon={faPencil} style={{width: "13px", height: "13px", cursor:"pointer"}}/>&#xA0;
          <FontAwesomeIcon onClick={() => deleteTitle(title)} icon={faTrashCan} style={{width: "13px", height: "13px", cursor:"pointer"}}/><br/>
          {rowClicked[title] == true?<p>{all_habits[title]}</p>:<br/>}
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
  const all_habits = {"Title": "Description",
   "Title 2": "this a random long piece of text yes very long it is even more longer now ha",
  "Another Big Long Title": "woah"}
  return {
    props: {
        user: JSON.stringify(user),
        all_habits: JSON.stringify(all_habits)
    },
  }
}