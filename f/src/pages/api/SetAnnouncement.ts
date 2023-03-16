import API from "@/env";
import Announcement from "@/types/Announcement";
import axios from "axios";

const SetAnnouncement = async (saveAnnouncementRequest:Announcement) =>
{

  try
  {

    const repsonse = await axios.post(`${API}/save-announcement`, saveAnnouncementRequest)
    console.log(repsonse);
    
    return repsonse.data

  } catch (error)
  {
    console.log(error);
  }

}

export default SetAnnouncement;