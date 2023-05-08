import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
import { get_user } from "../lib/database"
import styles from '../styles/dashboard.module.css'
import { useState } from "react";

export default function Home( { user } ) {
  const [pfpClicked, setPfpClicked] = useState(false)
  user = JSON.parse(user)
  console.log(user)
  function clickPfp(){
    if (pfpClicked == false){
      document.getElementById("pfp").classList.add(styles.pfpclick);
      setPfpClicked(true)
    } else {
      document.getElementById("pfp").classList.remove(styles.pfpclick);
      setPfpClicked(false)
    }
  }
  return (
    <Layout pageTitle="Dashboard">
      <img id="pfp" onClick={clickPfp} className={styles.pfp} src={user.image} alt="profile pic"></img>
      <p>{user.email}</p>
      <h4>Signed in as <strong>{user.name}</strong></h4>
      <button onClick={() => signOut()}>Sign out</button>
      <h2>All Habits</h2>
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
  return {
    props: {
        user: JSON.stringify(user)
    },
  }
}