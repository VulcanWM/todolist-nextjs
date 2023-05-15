import { get_user_without_set } from "../lib/database";

export default function User( {user} ) {
  user = JSON.parse(user)
  var y = 170;
  return (
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
     <g>
      <title>{user.username}'s Repl Stats</title>
      <path stroke="#3c445c" id="svg_1" d="m19.5,39.50002c0,-8.15068 7.84273,-15 17.17557,-15l715.64883,0c9.33284,0 17.17557,6.84932 17.17557,15l0,417c0,8.15068 -7.84273,15 -17.17557,15l-715.64883,0c-9.33284,0 -17.17557,-6.84932 -17.17557,-15l0,-417z" opacity="undefined" stroke-width="7" fill="#0e1525"/>
  <text textAnchor="start" fontSize="51" id="svg_13" y="135" x="260" strokeWidth="7" fill="#ffffff">{user.username}</text>
  {/* {Object.keys(user.todo).map((index) =>(
    <text textAnchor="start" fontSize="30" id="svg_13" y={y} x="260" strokeWidth="7" fill="#ffffff">{user.todo[index].title}</text>
  ))} */}
  </g>
  </svg>
  );
}

export async function getServerSideProps(context) {
  const username = context.query.username
  const user = await get_user_without_set(username)
  console.log(user)
  return {
    props: {
        user: JSON.stringify(user)
    },
  }
}