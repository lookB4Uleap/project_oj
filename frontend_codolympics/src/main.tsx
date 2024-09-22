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
import { CreateQuestion } from "./routes/CreateQuestion";

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
        path: "/problems/:problemId",
        element: <Problems />,
    },
    {
        path: "/playground",
        element: <Playground />,
    },
    {
        path: "/createQuestion",
        element: <CreateQuestion />,
    },
]);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

createRoot(document.getElementById("root")!).render(
    <App>
        <StrictMode>
            <ThemeProvider theme={darkTheme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </StrictMode>
    </App>
);
