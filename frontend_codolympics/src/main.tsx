import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import { createTheme, ThemeProvider } from "@mui/material";
import { App } from "./App";
import { Problems } from "./routes/Problems";
import { Playground } from "./routes/Playground";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/problems",
        element: <Problems />
    },
    {
        path: "/playground",
        element: <Playground />
    }
]);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={darkTheme}>
            <App>
                <RouterProvider router={router} />
            </App>
        </ThemeProvider>
    </StrictMode>
);