import { requireUNAuth } from "@/lib/auth-utils";
import LoginForm from "../_components/LoginForm";

const Login = async () => {
  await requireUNAuth();
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;
