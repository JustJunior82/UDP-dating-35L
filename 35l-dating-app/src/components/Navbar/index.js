import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const AuthNavbar = () => {
    return (
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
                    <NavLink to="/profile" >
                        Profile
                    </NavLink>
                    <NavLink to="/settings" >
                        Settings
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

const DefaultNavBar = () => {
    return (
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
                        Login/Register
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
}

function Navbar({ isLoggedIn }) {
    return isLoggedIn ? <AuthNavbar /> : <DefaultNavBar />;
}
 
export default Navbar;