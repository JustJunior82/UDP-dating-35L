import React from "react";

async function createUser(username, password) {
    let res = await fetch('http://localhost:12345/api/register', {
        method: 'POST',
        // headers: {
        //     'content-type': 'application/json'
        // },
		// username: 'admin',
		// password: 'password123',
		// email: 'admin@email.com',
        // body: JSON.stringify({
        //     username: 'admin',
        //     password: 'password123',
		// 	email: 'admin@email.com'
        // }),
    });

    if(await res.status !== 200) {
        alert("Creating a user failed!");
        return;
    }

    let json = await res.json();
    console.log(json);
}

const Home = ({ isAuth, onLogIn, onLogOut }) => {
	return (
		<div>
			<h1>Finish Home Page</h1>
			<h3>Dummy Elements to check behavior</h3>
			<p>User is Logged in: {isAuth} </p>
			<button onClick={onLogIn}>Log In</button>
			<button onClick={onLogOut}>Log Out</button>
			<button onClick={createUser}>Create User</button>
		</div>
	);
};

export default Home;
