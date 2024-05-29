import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const AuthNavbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        Home
                    </NavLink>
                    <NavLink to="/about" activeStyle>
                        About
                    </NavLink>
                    <NavLink to="/contact" activeStyle>
                        Contact Us
                    </NavLink>
                    <NavLink to="/posts" activeStyle>
                        Posts
                    </NavLink>
                    <NavLink to="/profile" activeStyle>
                        Profile
                    </NavLink>
                    <NavLink to="/settings" activeStyle>
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