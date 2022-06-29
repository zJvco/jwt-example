import { useEffect, useState } from "react";

import InputField from "./components/InputField";
import Button from "./components/Button";
import UserInfoField from "./components/UserInfoField";

import './App.css';

const API_URL = "http://127.0.0.1:8080/api/v1";

function App() {
  const [loginFormData, setLoginFormData] = useState({});
  const [registerFormData, setRegisterFormData] = useState({});

  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      setUser(userInfo);
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      (async () => {
        const config = {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
  
        try {
          const res = await fetch(`${API_URL}/resources`, config);
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.message);
          }
  
          setResources(data);
        } catch (error) {
          setMessage(error.message);
          console.error(error.message);
        }
      })();
    }
  }, [isAuth]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    (async () => {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginFormData)
      }

      try {
        const res = await fetch(`${API_URL}/login`, config);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        setIsAuth(true);
        setMessage("User Logged In");
      } catch (error) {
        setMessage(error.message);
        console.error(error.message);
      }
    })();

    setLoginFormData({});
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    (async () => {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerFormData)
      }

      try {
        const res = await fetch(`${API_URL}/register`, config);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setMessage(data.message);
      } catch (error) {
        setMessage(error.message);
        console.error(error.message);
      }
    })();

    setRegisterFormData({});
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <div className='container'>
      <Button onClick={handleLogout}>
        LOGOUT
      </Button>
      <div className='login-container'>
        <h2>Login Form</h2>
        <form onSubmit={handleLoginSubmit}>
          <InputField
            label="Username"
            type="text"
            onChange={(e) => setLoginFormData({...loginFormData, name: e.target.value})}
            value={loginFormData.name || ""}
          />
          <InputField
            label="Password"
            type="password"
            onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
            value={loginFormData.password || ""}
          />
          <Button type="submit">
            LOGIN
          </Button>
        </form>
      </div>
      <div className='register-container'>
        <h2>Registration Form</h2>
        <form onSubmit={handleRegisterSubmit}>
          <InputField
            label="Username"
            type="text"
            onChange={(e) => setRegisterFormData({...registerFormData, name: e.target.value})}
            value={registerFormData.name || ""}
          />
          <InputField
            label="Password"
            type="password"
            onChange={(e) => setRegisterFormData({...registerFormData, password: e.target.value})}
            value={registerFormData.password || ""}
          />
          <InputField
            label="Confirm Password"
            type="password"
            onChange={(e) => setRegisterFormData({...registerFormData, password_confirm: e.target.value})}
            value={registerFormData.password_confirm || ""}
          />
          <Button type="submit">
            REGISTER
          </Button>
        </form>
      </div>
      <div className="user-info-container">
        <h2>User Information</h2>
        {isAuth && (
          <>
            <UserInfoField title="ID" value={user.id} />
            <UserInfoField title="Username" value={user.name} />
            <UserInfoField title="Password" value={user.password} />
          </>
        )}
        <UserInfoField title="Authenticated" value={isAuth.toString()} />
      </div>
      {message && (
        <div className="message-container" style={{
          backgroundColor: "#CCC",
          width: "100%",
          padding: "10px",
          margin: "20px 0",
          textAlign: "center",
          borderRadius: "4px"
        }}>
          <span style={{ fontSize: "0.8rem" }}>{message}</span>
        </div>
      )}
      {resources.length !== 0 && (
        <div className="resources-container">
          <h2>Resources</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{e.name}</td>
                    <td>{e.color}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;