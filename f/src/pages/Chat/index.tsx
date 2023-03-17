import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import s from '@/styles/HomePage.module.css'
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { useEffect, useState } from "react";
import getUserFromToken from "../api/User-APIs/getuser";

const ChatPage = () =>
{

 const [user, setUser] = useState<User | undefined>(undefined)
 const [targetPerson, setTargetPerson] = useState<User | undefined>(undefined)

 useEffect(() =>
 {
  const getCurrUser = async () =>
  {
   const ob = {
    JWToken: getCookie("JWToken")
   }
   const response = await getUserFromToken(ob)
   setUser(
    {
     First_name: response.first_name,
     Last_name: response.last_name,
     Email: response.email,
     Password: response.password,
     Phone_num: response.phone_num,
     Email_subscriber: response.email_subscriber,
     Role_name: response.role_name,
     Status: response.status,
     id: response.id,
     balance: response.balance
    })
  }
  getCurrUser();
 }, [])

 const socket = new WebSocket('ws://localhost:8088/send-message');

 socket.onopen = (event) =>
 {
  console.log('WebSocket connection opened');
  socket.send(JSON.stringify({
   from: 'user1',
   to: 'user2',
   message: 'Hello user2!'
  }));
 };

 socket.onmessage = (event) =>
 {
  console.log('Received message from server:', event.data);
 };

 socket.onerror = (event) =>
 {
  console.error('WebSocket error:', event);
 };

 socket.onclose = (event) =>
 {
  console.log('WebSocket connection closed:', event);
 };

 return (
  <>
   <Navbar />
   <HeaderModule />
   <div className={s.chatpage}>
    <div className={s.chatlist}>
     <h1 className={s.title}>
      Chat
     </h1>
    </div>
    <div className={s.chatcontent}>
     <h1 className={s.title}>
      {(targetPerson) ? targetPerson.First_name + " " + targetPerson.Last_name : "Message"}
     </h1>
    </div>
   </div>
   <Footer />
  </>
 );
}

export default ChatPage;