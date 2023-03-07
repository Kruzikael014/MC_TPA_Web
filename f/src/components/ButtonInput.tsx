import s from "@/styles/HomePage.module.css"

interface ButtInterface
{
  placeholder?: string,
  submit?: boolean,
  orange?: boolean
  blue?: boolean
  width?: number
  height?: number
  func?: Function
  centered?: boolean
}

const ButtonInput = (props: ButtInterface) =>
{

  const { placeholder, submit, orange, blue, width, height, func, centered } = props

  const getButtonType = () =>
  {
    if (submit) return "submit"
    else return "button"
  }

  const drawColor = () =>
  {
    if (orange) return s.buttoninputmain
    if (blue) return s.buttoninputblue
    else return s.buttoninputelse
  }

  return (
    <>
      <button type={getButtonType()} className={drawColor()} style={(!centered) ? {width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      textAlign: "center"} : {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }} onClick={(func !== undefined) ? (e) => { func() } : (e) => {  }}
      
      
      >
        {placeholder}
      </button>
    </>
  );
}

export default ButtonInput;