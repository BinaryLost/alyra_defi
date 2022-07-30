import './StyleButton.css'
function StyledButton(props) {
  if(props.click){
    return <button onClick={props.click}>{props.text}</button>
  }
  return <button>{props.text}</button>
}

export default StyledButton;
