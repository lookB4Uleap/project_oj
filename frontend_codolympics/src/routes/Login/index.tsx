import LoginForm from "./components/LoginForm";

const Login = () => {
    return (
		<div 
			className="flex flex-1 flex-col 
					items-center justify-center 
					h-full
					bg-[url('/backgrounds/endless-constellation.svg')]"
		>
			<LoginForm />
		</div>
	);
};

export default Login;
