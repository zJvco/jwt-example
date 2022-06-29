import "./UserInfoField.css";

function UserInfoField({ title, value }) {
    return (
        <div className="user-info-field">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    )
}

export default UserInfoField;