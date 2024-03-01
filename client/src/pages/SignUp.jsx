import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [validationError, setValidationError] = useState(null);

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setValidationError("All fields are mandatory");
    }
    mutate(formData);
  }

  const { mutate, isError, isSuccess, isPending, error, data } = useMutation({
    mutationFn: ({ username, email, password }) =>
      createUser(username, email, password),
    onSuccess: () => {
      navigate("/sign-in");
    },
    onError: () => {
      setValidationError(null);
    },
  });

  const errorMessage = validationError || error?.response?.data?.message;

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Anoop's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            You can sign up with your email and password or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading....</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {validationError || isError ? (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
