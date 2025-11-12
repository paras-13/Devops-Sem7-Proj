import { useState } from "react";
import { Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      console.log(inputs);
      await makeRequest.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  };
  console.log(error);
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Varta</h1>
          <p>
            "Welcome to Varta, a space designed for meaningful conversations and
            vibrant communities. Create your profile and start connecting
            today!"
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {error && <span style={{ color: "red" }}>{error}</span>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
