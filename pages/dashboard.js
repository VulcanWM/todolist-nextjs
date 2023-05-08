import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
import { get_user } from "../lib/database"

export default function Home( { user } ) {
  user = JSON.parse(user)
  console.log(user)
  return (
    <Layout>
        <h4>Signed in as <strong>{user.name}</strong></h4>
        <button onClick={() => signOut()}>Sign out</button>
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
  const user = await get_user(email, name)
  return {
    props: {
        user: JSON.stringify(user)
    },
  }
}