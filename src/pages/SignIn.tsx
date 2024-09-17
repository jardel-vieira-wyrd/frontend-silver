import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Button } from "@/assets/ui/button";
import { Input } from "@/assets/ui/input";
import { Label } from "@/assets/ui/label";
import { auth } from "../api/api";
import { useAuthStore } from "../stores/authStore";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm(e.currentTarget)) {
      return;
    }

    try {
      const response = await auth.login({ email, password });

      if (response && response.user && response.token) {
        login(response.user, response.token);
        navigate("/taskboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Invalid email or password!");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const validateForm = (form: HTMLFormElement): boolean => {
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (passwordInput.value.length < 1) {
      setError("Please enter your password");
      return false;
    }

    return true;
  };

  const setCustomValidity = (e: React.InvalidEvent<HTMLInputElement>) => {
    const input = e.target;
    switch (input.id) {
      case 'email':
        input.setCustomValidity(input.validity.typeMismatch ? "Please enter a valid email address" : "");
        break;
      case 'password':
        input.setCustomValidity(input.value ? "" : "Please enter your password");
        break;
    }
  };

  const clearCustomValidity = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("");
  };

  return (
    <Layout>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInvalid={setCustomValidity}
              onInput={clearCustomValidity}
              required
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            />
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onInvalid={setCustomValidity}
              onInput={clearCustomValidity}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between gap-4">
            <Link to="/" className="w-full">
              <Button type="button" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">* All fields are required</p>
        </form>
      </div>
    </Layout>
  );
}

export default SignIn;
