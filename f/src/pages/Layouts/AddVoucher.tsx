


import ButtonInput from "@/components/ButtonInput"
import InputField from "@/components/InputField"
import styles from "@/styles/HomePage.module.css"
import CreateVoucherRequest from "@/types/CreateVoucherRequest"
import { useState } from "react"
import CreateVoucher from "../api/CreateVoucher"


const AddVoucher = () =>
{

  const [voucherName, setVoucherName] = useState("")
  const [voucherValue, setVoucherValue] = useState(undefined)

  const handleCreateVoucher = async () =>
  {
    if (voucherName.length !== 12) {
      alert("Length must be exactly 12 characters!")
      return
    }
    if (voucherValue !== undefined && voucherValue <= 0) {
      alert("Value of the voucher must not be 0!")
      return
    }

    const request:CreateVoucherRequest = {
      value: Number(voucherValue),
      voucher_name: voucherName
    }
    const response = await CreateVoucher(request)
    
    if (!String(response).includes("successfully created!")) {
      alert("Failed to generate voucher!")
      return
    }
    alert(response)
    window.location.reload()
  }

  return (
    <div className={styles.AddVoucher}>

      <h1>
        Create Voucher
      </h1>

      <InputField width={800} text onChange={setVoucherName} value={voucherName} placeholder={"Voucher code, e.g. 01234568912"} />
      <InputField width={800} onChange={setVoucherValue} value={voucherValue} required number placeholder={"Voucher value, e.g. 500,000"} />
      <ButtonInput blue placeholder={"Create Voucher"} func={handleCreateVoucher} centered width={240} />
    </div>
  )
}

export default AddVoucher