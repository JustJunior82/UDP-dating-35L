import React from "react";
import { useNavigate } from "react-router-dom";

function Home ({ isAuth, onLogIn, onLogOut }) {
    const navigate = useNavigate();
	return (
		<div>
			<h1>Finish Home Page</h1>
			<h3>Dummy Elements to check behavior</h3>
			<p>User is Logged in: {isAuth} </p>
			<button onClick={onLogIn}>Log In</button>
			<button onClick={onLogOut}>Log Out</button>
			<h3>Want to experience the magic of UDP matchmaking?</h3>
			<button onClick={() => navigate('/registration')}>Get Started</button>
		</div>
	);
};

export default Home;
