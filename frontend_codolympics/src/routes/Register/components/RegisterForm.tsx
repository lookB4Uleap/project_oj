import { Alert, CircularProgress, Collapse, TextField } from "@mui/material";
import { PasswordField } from "../../../components/PasswordField";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { api } from "../../../api";
import { AuthContext } from "../../../contexts/AuthContext";
import { ErrorType } from "../../Login/components/LoginForm";

type FormDataType = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const RegisterForm = () => {
    const [formData, setFormData] = useState<FormDataType>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ErrorType>({
        open: false,
        message: "",
        error: null,
    });
    const { updateAuth } = useContext(AuthContext);
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
        // TODO: Add checks for correct data registration
        setLoading(true);

        try {
            const { data } = await api.post("/api/v1/users/register", formData);
            console.log("[Register] Data ", data);
            updateAuth(data);
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
            <div className="text-3xl mb-10">Create a Codolympics account</div>
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
                    name="username"
                    required
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleFormChange(e)}
                    style={{ marginBottom: 10 }}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    variant="outlined"
                    color="secondary"
                    type="email"
                    name="email"
                    required
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleFormChange(e)}
                    style={{ marginBottom: 10 }}
                />
                <PasswordField
                    label="Password"
                    name="password"
                    id="password"
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleFormChange(e)}
                />
                <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    id="confirm_password"
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleFormChange(e)}
                />
                <button
                    className="flex items-center justify-center 
                        h-11  mt-5 min-w-20
                        bg-blue-600 border-transparent  border-2 
                        hover:border-blue-950
                    "
                    type="submit"
                >
                    {!loading ? (
                        "Register"
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
                <div className="mr-2">Already registered?</div>
                <Link to={"/login"}>Login now!</Link>
            </div>
        </div>
    );
};
