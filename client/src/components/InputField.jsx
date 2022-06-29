import "./InputField.css";

function InputField(props) {
    return (
        <div className='input-field'>
            <label>{props.label}</label>
            <input type={props.type} onChange={props.onChange} value={props.value} />
        </div>
    );
}

export default InputField;