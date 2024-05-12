import React from "react";

const Home = ({ isAuth, onLogIn, onLogOut }) => {
	return (
		<div>
			<h1>Finish Home Page</h1>
			<h3>Dummy Elements to check behavior</h3>
			<p>User is Logged in: {isAuth} </p>
			<button onClick={onLogIn}>Log In</button>
			<button onClick={onLogOut}>Log Out</button>
		</div>
	);
};

export default Home;
