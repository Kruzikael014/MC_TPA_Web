import ButtonInput from "@/components/ButtonInput";
import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import s from '@/styles/HomePage.module.css'
import Chat from "@/types/Chat";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { useEffect, useState } from "react";
import GetChat from "../api/Chat-APIs/GetChat";
import GetRecentChat from "../api/Chat-APIs/GetRecentChat";
import getUserFromToken from "../api/User-APIs/getuser";
import GetUserFromId from "../api/User-APIs/GetUserFromId";

const CHAT_SOCKET_KEY = "chat_socket";

const ChatPage = () =>
{
  const [admin, setAdmin] = useState<User | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [targetPerson, setTargetPerson] = useState<User | undefined>(undefined);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [message, setMessage] = useState("")

  const [ourChat, setOurChat] = useState<Chat[] | undefined>()
  const [chatSubject, setChatSubject] = useState<User[] | undefined>(undefined);



  useEffect(() =>
  {
    const fetchChatting = async () =>
    {
      if (user !== undefined && targetPerson !== undefined)
      {
        const response = await GetChat(String(user.id), String(targetPerson.id))
        console.log(response);
        if (Array.isArray(response) === false)
        {
          alert(response)
          return
        }
        setOurChat(response)
      }
    }
    fetchChatting()
  }, [user, admin, targetPerson, socket, message])

  useEffect(() =>
  {
    const getAdmin = async () =>
    {
      const response = await GetUserFromId(1);
      setAdmin((prev) => ({
        ...prev,
        balance: response.balance,
        Email: response.email,
        Email_subscriber: response.email_subscriber,
        First_name: response.first_name,
        Last_name: response.last_name,
        Password: response.password,
        Phone_num: response.phone_num,
        Role_name: response.role_name,
        Status: response.status,
        id: response.id,
      }));
    };
    getAdmin();

  }, []);

  useEffect(() =>
  {
    if (socket !== undefined)
    {
      socket.onmessage = (event) =>
      {
        const message = JSON.parse(event.data);
        console.log("Received message: ", message);

        setOurChat((prevChat) =>
        {
          if (prevChat !== undefined && Array.isArray(prevChat))
          {
            const newChat = [...prevChat, message];
            return newChat;
          }
          return prevChat;
        });
      };
    }
  }, [socket]);

  useEffect(() =>
  {
    const getCurrUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken"),
      };
      const response = await getUserFromToken(ob);
      setUser({
        First_name: response.first_name,
        Last_name: response.last_name,
        Email: response.email,
        Password: response.password,
        Phone_num: response.phone_num,
        Email_subscriber: response.email_subscriber,
        Role_name: response.role_name,
        Status: response.status,
        id: response.id,
        balance: response.balance,
      });
    };
    getCurrUser();
  }, []);



  useEffect(() =>
  {
    const chatSocket = localStorage.getItem(CHAT_SOCKET_KEY);
    if (chatSocket)
    {
      const newSocket = new WebSocket(chatSocket);
      setSocket(newSocket);
    } else
    {
      const newSocket = new WebSocket("ws://localhost:8088/send-message");
      setSocket(newSocket);
      localStorage.setItem(CHAT_SOCKET_KEY, "ws://localhost:8088/send-message");
    }
  }, []);

  const sendMessage = (message: string) =>
  {
    if (socket !== undefined && user !== undefined && targetPerson !== undefined)
    {
      console.log(user);
      console.log("Sending message : " + message);
      console.log(targetPerson);
      socket.send(JSON.stringify({
        from: String(user?.id),
        to: String(targetPerson?.id),
        message: String(message)
      }));
    }
  }

  useEffect(() =>
  {
    const fetchRecentChats = async () =>
    {
      if (user !== undefined)
      {
        const response = await GetRecentChat(Number(user.id));
        if (Array.isArray(response))
        {
          console.log(response);
          setChatSubject(response);
          console.log(chatSubject);
        } else
        {
          alert(response);
        }
      }
    };
    fetchRecentChats();
  }, [user?.id]);

  const handleMessageSend = () =>
  {

    if (message !== "")
    {
      sendMessage(message)
      setMessage("")
    }

  }

  return (
    <>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />
      <div className={s.chatpage}>
        <div className={s.chatlist}>
          <h1 className={s.title}>
            Chat
          </h1>

        </div>
        {
          targetPerson !== undefined &&
          <div className={s.rightcontainer}>
            <h1 className={s.title} >
              {(targetPerson.First_name + " " + targetPerson.Last_name === "Mighty Admin") ? "Customer Center" : targetPerson.First_name + " " + targetPerson.Last_name}
            </h1>
            {
              ourChat !== undefined && Array.isArray(ourChat) &&
              (
                <div className={s.chatcontent}>
                  {
                    ourChat.map((chat: Chat, index: number) =>
                    {
                      return (
                        <div className={`${(String(chat.from) !== String(user?.id)) ? s.to : s.from}`}>
                          <div className={s.chatbubble}>
                            {chat.message}
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
            <div className={s.inputbar}>
              <input type={"text"} className={s.input} onChange={(e) => { setMessage(e.target.value) }} value={message} />
              <p className={s.buttonsend} onClick={handleMessageSend} >
                Send
              </p>
            </div>
          </div>
        }
        {
          targetPerson === undefined &&
          <h1 className={s.title}>
            Message
          </h1>
        }
      </div>
      <Footer />
    </>
  );
};

export default ChatPage;

interface ChatCardInterface
{
  userTo: User | undefined
}

const ChatCard = (props: ChatCardInterface) =>
{

  const { userTo } = props

  return (
    <div className={s.chatcard}>
      <div className={s.profandname}>
        <div className={s.profile}>
          <i className="fa-solid fa-user fa-2x"></i>
        </div>
        <div className={s.name}>
          {(userTo?.First_name + " " + userTo?.Last_name === "Mighty Admin") ? "Customer Center" : userTo?.First_name + " " + userTo?.Last_name}
        </div>
      </div>
      <br />
      <hr />
    </div>
  )
}

export { ChatCard }

export function ChatLeftSection()
{
  return (
    <div className={s.chatlists}>
      <div className={s.chtcart} onClick={(e) => { setTargetPerson(admin) }}>
        {(user?.Role_name !== "Admin") ? <ChatCard userTo={admin} /> : ""}
        {
          chatSubject !== undefined &&
          Array.isArray(chatSubject) &&
          chatSubject.map((subject: User, index: number) =>
          {
            return (
              <ChatCard userTo={subject} key={index} />
            )
          })
        }
      </div>
    </div>
  )
}