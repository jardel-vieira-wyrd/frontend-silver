import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Button } from "@/assets/ui/button";
import { Input } from "@/assets/ui/input";
import { Label } from "@/assets/ui/label";
import { auth } from "../api/api";
import axios, { AxiosError } from "axios";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm(e.currentTarget)) {
      return;
    }

    try {
      await auth.register({ name, email, password });
      navigate("/signin");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 409) {
          setError("This email is already registered. Please use a different email or try logging in.");
        } else {
          setError(axiosError.response?.data?.message || "Registration failed. Please try again.");
        }
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const validateForm = (form: HTMLFormElement): boolean => {
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    if (nameInput.value.length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (passwordInput.value.length < 3) {
      setError("Password must be at least 3 characters long");
      return false;
    }

    return true;
  };

  const setCustomValidity = (e: React.InvalidEvent<HTMLInputElement>) => {
    const input = e.target;
    switch (input.id) {
      case 'name':
        input.setCustomValidity(input.value ? "" : "Please enter your name");
        break;
      case 'email':
        input.setCustomValidity(input.validity.typeMismatch ? "Please enter a valid email address" : "");
        break;
      case 'password':
        input.setCustomValidity(input.value ? "" : "Please enter a password");
        break;
    }
  };

  const clearCustomValidity = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("");
  };

  return (
    <Layout>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onInvalid={setCustomValidity}
              onInput={clearCustomValidity}
              required
              minLength={2}
            />
          </div>
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
              minLength={8}
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
              Sign Up
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">* All fields are required</p>
        </form>
      </div>
    </Layout>
  );
}

export default SignUp;
