import { RegisterForm } from "./components/RegisterForm";

const Register = () => {
    return (
        <div
            className="flex flex-1 flex-col 
					items-center justify-center 
					h-full
					bg-[url('../../../public/backgrounds/endless-constellation.svg')]"
        >
            <RegisterForm />
        </div>
    );
};

export default Register;
