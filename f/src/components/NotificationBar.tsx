import User from "@/types/User";
import styles from '@/styles/HomePage.module.css'
import { useEffect, useState } from "react";
import Announcement from "@/types/Announcement";
import GetAnnouncement from "@/pages/api/GetAnnouncement";

interface NotifBarInterface
{
  user: User
}

const NotificationBar = (props: NotifBarInterface) =>
{

  const { user } = props
  const { Email, Email_subscriber, First_name, Last_name, Password, Phone_num, Role_name, Status, balance, id } = user
  const [announcements, setAnnouncements] = useState<Announcement[] | undefined>(undefined)

  useEffect(() =>
  {
    console.log("a");
    const fetchAnnouncement = async () =>
    {
      if (user !== undefined)
      {
        const response = await GetAnnouncement(Number(id))
        setAnnouncements(response)
        console.log(response);
      }
    }
    fetchAnnouncement()
  }, [])

  return (
    <>
      <div className={styles.notifbar}>
        {
          announcements && Array.isArray(announcements) ?
            (
              announcements?.map((annoucement: Announcement, index: number) =>
              {
                return <>
                  <div className={styles.bubble} key={index}>
                    <div className={styles.chat} >
                      {annoucement.announcement_message}
                    </div>
                    <div>
                      On {annoucement.created_at?.toString()}
                    </div>
                  </div>
                </>
              })
            )
            :
            (
              <div>{announcements}</div>
            )
        }
      </div>
    </>
  );
}

export default NotificationBar;