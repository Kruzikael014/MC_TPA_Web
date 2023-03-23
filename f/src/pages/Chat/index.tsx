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

  useEffect(() =>
  {
    console.log(targetPerson);
    const fetchChatting = async () =>
    {
      console.log(targetPerson);
      if (user !== undefined && targetPerson !== undefined)
      {
        const response = await GetChat(String(user.id), String(targetPerson.id))
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
  }, [user, admin, targetPerson, socket, message]);

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
  }, [user, admin, targetPerson, message]);

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
          <div className={s.chatlists} onClick={(e) => { setTargetPerson(admin) }}>
            {user?.Role_name !== "Admin" && <ChatCard userTo={admin} />}
          </div>
          <ChatLeftSection setTargetPerson={setTargetPerson} user={user} />
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


interface ChatLeftSectionInterface
{
  setTargetPerson: Function,
  user: User | undefined,
}

export function ChatLeftSection(props: ChatLeftSectionInterface)
{
  const { setTargetPerson, user } = props;
  const [recentIds, setRecentIds] = useState([])

  useEffect(() =>
  {
    const getRecentChatIds = async () =>
    {
      if (user !== undefined)
      {
        const response = await GetRecentChat(Number(user.id))
        if (Array.isArray(response) === false)
        {
          alert(response)
          return
        }
        setRecentIds(response)
      }

    };
    getRecentChatIds();
  }, [user]);

  return (
    <div className={s.chatlists} >
      {recentIds && Array.isArray(recentIds) &&
        recentIds.map((number: number, index: number) =>
        {
          return (
            <div>
              {(number === 1) ? "" :
                <FetchingChatCard id={number} setTargetPerson={setTargetPerson} />}
            </div>
          )
        })
      }
    </div>
  );
}


interface ChatCardInterface
{
  userTo: User | undefined,
}

const ChatCard = (props: ChatCardInterface) =>
{
  const { userTo } = props;
  const name = userTo?.First_name && userTo?.Last_name ? `${userTo.First_name} ${userTo.Last_name}` : "Unknown User";

  return (
    <div className={s.chatcard}>
      <div className={s.profandname}>
        <div className={s.profile}>
          <i className="fa-solid fa-user fa-2x"></i>
        </div>
        <div className={s.name}>
          {(name === "Mighty Admin") ? "Customer Center" : name}
        </div>
      </div>
      <br />
      <hr />
    </div>
  )
}


export { ChatCard }



interface FetchingChatCardInterface
{
  id: number,
  setTargetPerson: Function
}

const FetchingChatCard = (props: FetchingChatCardInterface) =>
{
  const { id, setTargetPerson } = props;
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() =>
  {

    const fetchUser = async () =>
    {
      if (id !== undefined)
      {
        const response = await GetUserFromId(Number(id))
        setUser(prevUser => ({
          ...prevUser,
          id: response.id,
          First_name: response.first_name,
          Last_name: response.last_name,
          Email: response.email,
          Password: response.password,
          Phone_num: response.phone_num,
          Email_subscriber: response.email_subscriber,
          Status: response.status,
          Role_name: response.role_name,
          balance: response.balance
        }))
      }
    }
    fetchUser()

  }, [id])

  return (
    <div onClick={(e) => { setTargetPerson(user) }}>
      <ChatCard userTo={user} />
    </div>
  )
}


export { FetchingChatCard }