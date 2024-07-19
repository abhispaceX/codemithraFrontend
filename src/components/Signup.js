import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import validator from "validator";
import axios from 'axios';

const Signup = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        username: ""
    });
    const [usernameError, setUsernameError] = useState('');
    const [mailError, setMailError] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const validate = (value) => {
        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setErrorMessage('');
        } else {
            setErrorMessage('Password is not Strong!!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/signup', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response);
            if (response.status === 201) {
                alert(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.log("Error occurred while signing up:", error.response.data);
            if (error.response.data.error === "Username already exists") {
                setUsernameError("Username already exists");
            } else if (error.response.data.error === "Mail already exists") {
                setMailError("Mail already exists");
            }
        }
    };

    const handleChange = (e) => {
        setData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
        if (e.target.name === 'password') {
            validate(e.target.value);
        }
    };
    return(

    <div className=" flex flex-col container bg-[url('https://www.shutterstock.com/shutterstock/photos/2382150379/display_1500/stock-vector-finance-control-hand-drawn-composition-expense-tracker-in-mobile-bank-account-smartphone-app-with-2382150379.jpg')]   items-center h-screen justify-center bg-main bg-cover " > 
       <form className=" bg-gray-100 shadow-md rounded px-10 pt-6 pb-8 mr-24 mb-4 w-4/12 " onSubmit={handleSubmit} >
         <h2 class=" text-xl font-bold" >Create an Account</h2>
          <label htmlFor='name'> Name:</label>
          <input  className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="name" id="name" name="name" value={data.name} onChange={handleChange} placeholder="name" required ></input>
     <label htmlFor='username'>Username:</label>
      <input
        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${usernameError ? "border-red-500" : ""}`}
        type="text"
        id='username'
        value={data.username}
        onChange={handleChange}
        name="username"
        required
      />
      {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}

      <label htmlFor="email">Email:</label>
      <input
        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${mailError ? 'border-red-500' : ''}`}
        type="email"
        id="email"
        value={data.email}
        onChange={handleChange}
        name="email"
        required
      />
      {mailError && <p className="text-red-500 text-sm mt-1">{mailError}</p>}
          <label htmlFor="password">Password:</label>
          <input  className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" id="password" name="password"  value={data.password} onChange={handleChange} placeholder="******************" required ></input>
          {errorMessage === '' ? null : 
                    <p className="   text-xs  text-red-600" >{errorMessage}</p>} 

          <label htmlFor="confirmPassword" >Confirm Password:</label> 
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="confirmPassword" id="confirmPassword" name="confirmPassword" value={data.confirmPassword} placeholder="******************" onChange={handleChange} required  ></input>
          

          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-3 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign In
          </button>
          
       </form>
    </div>
    )// ... rest of your component (JSX) remains the same
};

export default Signup;