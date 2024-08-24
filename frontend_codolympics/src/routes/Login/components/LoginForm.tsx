import { Alert, CircularProgress, Collapse, TextField } from "@mui/material";
import { PasswordField } from "../../../components/PasswordField";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { api } from "../../../api";
import { AuthContext } from "../../../contexts/AuthContext";

type FormDataType = {
    username: string;
    password: string;
};

export type ErrorType = {
    open: boolean;
    message: string;
    error: any;
    status?: number;
};

const LoginForm = () => {
    const [formData, setFormData] = useState<FormDataType>({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ErrorType>({
        open: false,
        message: "",
        error: null
    });
    const { updateAuthToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        return () => setLoading(false);
    }, []);

    const handleFormChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prevData: FormDataType) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("[Login] User ", {
            formData,
            api: import.meta.env.VITE_API,
        });
        setLoading(true);

        try {
            const { data } = await api.post("/api/users/login", formData, {withCredentials: true});
            console.log("[Login] Data ", data);
            updateAuthToken(data?.tokens.authToken);
            navigate("/");
        } catch (err: any) {
            setLoading(false);
            // console.error(err);
            setError((prevError: ErrorType) => ({
                ...prevError,
                open: true,
                error: err,
                status: err.response.status,
                message: err.response.data.message,
            }));
        }
    };

    return (
        <div className="flex flex-1 flex-col items-center justify-center">
            <Collapse
                in={error.open}
                style={{
                    position: "absolute",
                    top: 0,
                }}
            >
                <Alert
                    severity="error"
                    onClose={() =>
                        setError(() => ({
                            ...error,
                            open: false,
                        }))
                    }
                >
                    {`${error?.status} ${error.message}`}
                </Alert>
            </Collapse>
            <div className="text-3xl mb-10">Login to Codolympics</div>
            <form
                className="flex flex-col items-center justify-center w-80 p-5"
                onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
            >
                <TextField
                    fullWidth
                    size="small"
                    label="Username"
                    variant="outlined"
                    color="secondary"
                    type="text"
                    required
                    name="username"
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleFormChange(e)}
                    style={{ marginBottom: 10 }}
                />
                <PasswordField
                    label="Password"
                    id="password"
                    name="password"
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleFormChange(e)}
                />
                <button
                    className="flex items-center justify-center 
                        h-11 mt-5 min-w-20
                        bg-blue-600 border-transparent  border-2 
                        hover:border-blue-950
                    "
                    type="submit"
                >
                    {!loading ? (
                        "Login"
                    ) : (
                        <CircularProgress
                            style={{ color: "inherit" }}
                            size={20}
                        />
                    )}
                </button>
            </form>
            <div
                className="
                    flex flex-row
                    justify-center items-center
                "
            >
                <div className="mr-2">Not an user?</div>
                <Link to={"/register"}>Register now!</Link>
            </div>
        </div>
    );
};

export default LoginForm;
