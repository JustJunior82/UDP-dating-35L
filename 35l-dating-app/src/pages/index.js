import React from "react";
import { useNavigate } from "react-router-dom";

import "../custom.scss";

function Home () {
    const navigate = useNavigate();
	return (
		<div className='home'>
			<div className='home-left'>
				<div className='home-title'>
					Want to experience the <span className='magic'>magic</span> of UDP matchmaking?
				</div>
				<div className='home-content'>
					Sign up now to find your perfect match!
				</div>
				<div className='home-button'>
					<button onClick={() => navigate('/registration')}>Get Started</button>
				</div>
			</div>
			<div className='home-right'>
				<div className='home-image'>
					<img 
						src='https://i.ibb.co/4PgLzww/ascii-text-art-bunny-rabbit-take-heart-back-lunch-bag-removebg-preview.png'
						alt=''
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
