import "./Button.css";

function Button(props) {
    if(props.click){
        return <button className= {props.clickable ? "test" : "not-clickable"} onClick={props.click}>{props.text}</button>
    }
    return (
        <button className= {props.clickable ? "test" : "not-clickable"} onClick={props.click}>
            {props.text}
        </button>
    );
}

export default Button;
