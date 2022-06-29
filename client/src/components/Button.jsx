import "./Button.css";

function Button(props) {
    return <button type={props.type} onClick={props.onClick}>{ props.children }</button>
}

export default Button;