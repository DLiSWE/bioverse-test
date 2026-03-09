import LoginForm from "@/components/composite/LoginForm";
import { Card } from "@/components/ui/card";

export default function Login() {
  return (
    <div className="flex items-center justify-center mx-8">
      <Card className="max-w-md mx-auto mt-10 p-6">
        <LoginForm />
      </Card>
    </div>
  );
}
