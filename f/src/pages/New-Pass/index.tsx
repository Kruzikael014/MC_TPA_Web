import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NewPassForm from "../Layouts/NewPassForm";

const NewPassFormx = () =>
{

  const [email, setEmail] = useState("")
  const router = useRouter()
  const query = router.query


  useEffect(() =>
  {

    setEmail(String(query.email))

  }, [])


  return (
    <>
      <NewPassForm email={email}  />
    </>
  );
}

export default NewPassFormx;