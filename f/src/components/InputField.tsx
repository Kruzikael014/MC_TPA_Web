import st from "@/styles/HomePage.module.css"
import { type } from "os"
import { ChangeEventHandler } from "react"

interface input
{
  placeholder?: string
  password?: boolean
  email?: boolean
  number?: boolean
  checkbox?: boolean
  value?: any
  onChange: any
  required?: boolean
  width?: number
  height?: number
  numberQty?: boolean
  text?: boolean
  type?: string
}

const InputField = (props: input) =>
{

  const { type, text, placeholder, password, email, value, onChange, required, number, checkbox, width, height, numberQty } = props

  const getInputType = () =>
  {
    if (type) return
    if (text) return "text"
    if (password) return "password"
    if (email) return "email"
    if (number) return "number"
    if (checkbox) return "checkbox"
    if (numberQty) return "number"
    else return "text"
  }

  return (
    <>
      <input placeholder={placeholder}
        type={type ? type : getInputType()}
        className={(numberQty) ? st.qtyinput : st.logreginput}
        value={value}
        onChange={(e) => { onChange(e.target.value) }}
        required={required}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
        min={0}
      />
    </>
  );
}

export default InputField;
// export const ButtonSign;