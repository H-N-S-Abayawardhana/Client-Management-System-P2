import React, { useState } from "react";
import Navbar from "../templetes/adminNavBar";
import Sidebar from "../templetes/SideBar";
import Footer from "../PagesFooter";
import { ToastContainer } from "react-toastify";

const Container = ({ child }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return React.createElement(
        "div",
        {
            className: "container-fluid d-flex flex-column vh-100 overflow-hidden",
            style: { paddingTop: 32 }
        },
        // Navbar
        React.createElement(Navbar, { onMenuToggle: toggleSidebar }),

        // Main Content
        React.createElement(
            "div",
            { className: "row flex-grow-1 overflow-hidden" },
            // Sidebar for larger screens
            React.createElement(
                "div",
                { className: "col-md-3 col-lg-2 d-none d-md-block sidebar-desktop" },
                React.createElement(Sidebar, null)
            ),
            // Scrollable Content
            React.createElement(
                "div",
                {
                    className: `col-md-9 col-lg-10 p-3 ${
                        sidebarVisible ? "blur-background" : ""
                    } overflow-auto`,
                    style: { maxHeight: "calc(100vh - 56px)" }
                },
                React.createElement("div", null, child)
            ),
            React.createElement(Footer, null)
        ),

        // Toast Container
        React.createElement(ToastContainer, null),

        // Sidebar Toggle Button
        React.createElement(
            "div",
            {
                className: `flex-grow-1 d-flex ${
                    sidebarVisible ? "show-sidebar" : ""
                }`
            },
            React.createElement(Sidebar, { sidebarVisible: sidebarVisible })
        ),

        // Footer
        React.createElement(Footer, null)
    );
};

export default Container;
