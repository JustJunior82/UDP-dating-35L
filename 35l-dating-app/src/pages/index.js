import React from "react";

const Home = ({ isAuth, onLogIn }) => {
	return (
		<div>
			<h1>Finish Home Page</h1>
			<p>User is Logged in: {isAuth} </p>
			<button onClick={onLogIn}>Log In</button>
		</div>
	);
};

export default Home;
