import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signIn } from "next-auth/react";
import Layout from '../components/layout'
import styles from '../styles/index.module.css'

export default function Home( ) {
  return (
      <Layout pageTitle="Home">
        <div className={styles.content}>
          <p><strong>Signin to view your dashboard!</strong></p>
          <br />
          <button onClick={() => signIn()}>Sign in</button>
        </div>
      </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {
    },
  }
}