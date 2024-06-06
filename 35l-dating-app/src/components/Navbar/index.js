import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

import '../../custom.scss';
import { GiLoveMystery } from "react-icons/gi";

const AuthNavbar = () => {
    return (
        <div className='navbar'>
            <>
                <Nav>
                    <NavMenu>
                        <NavLink to="/" >
                            Home
                        </NavLink>
                        <NavLink to="/about" >
                            About
                        </NavLink>
                        <NavLink to="/contact" >
                            Contact Us
                        </NavLink>
                        <NavLink to="/posts" >
                            Posts
                        </NavLink>
                        <NavLink to="/matching">
                            Matching
                        </NavLink>
                        <NavLink to="/profile" >
                            Profile
                        </NavLink>
                        <NavLink to="/messages" >
                            Messages
                        </NavLink>
                        <NavLink to="/settings" >
                            Settings
                        </NavLink>
                    </NavMenu>
                </Nav>
            </>         
        </div>
    );
};

const DefaultNavBar = () => {
    return (
        <div className='navbar'>
            <>
                <Nav>
                    <NavMenu>
                        <NavLink to="/" >
                            Home
                        </NavLink>
                        <NavLink to="/about" >
                            About
                        </NavLink>
                        <NavLink to="/contact" >
                            Contact Us
                        </NavLink>
                        <NavLink to="/posts" >
                            Posts
                        </NavLink>
                        <NavLink to="/login" >
                            Login
                        </NavLink>
                    </NavMenu>
                </Nav>
            </>
        </div>
    );
}

function Navbar({ isLoggedIn }) {
    return isLoggedIn ? <AuthNavbar /> : <DefaultNavBar />;
}
 
export default Navbar;