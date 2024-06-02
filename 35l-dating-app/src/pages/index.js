import React from "react";
import { useNavigate } from "react-router-dom";

function Home () {
    const navigate = useNavigate();
	return (
		<div>
			<h3>Want to experience the magic of UDP matchmaking?</h3>
			<button onClick={() => navigate('/registration')}>Get Started</button>
		</div>
	);
};

export default Home;
