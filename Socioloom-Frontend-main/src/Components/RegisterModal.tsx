import { IoMdClose } from "react-icons/io";
import "./RegisterModal.css";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoggedContext } from "../App";

const schema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters" })
      .regex(
        new RegExp("^[a-zA-Z][a-zA-Z0-9]{3,}$"),
        "Username must start with a letter and can only contain letters and numbers"
      ),
    displayName: z
      .string()
      .min(3, { message: "Display name must be at least 3 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 8 characters" })
      .regex(
        new RegExp(
          "^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()-__+.]){1,}).{8,}$"
        ),
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  setOpenModal: (arg: boolean) => void;
}

function Modal({ setOpenModal }: Props) {
  const login = useContext(LoggedContext);

  const navigate = useNavigate();

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const registerUser = (data: FieldValues) => {
    axios
      .post("http://localhost:3000/api/auth/register", data)
      .then((res) => {
        if (res.status === 200) {
          window.localStorage.setItem("token", res.data.token);
          window.localStorage.setItem("userId", res.data.user.id);
          login();
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === "Email already exists") {
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        } else if (err.response.data.message === "Username already exists") {
          setError("username", {
            type: "manual",
            message: "Username already exists",
          });
        } else if (
          err.response.data.message === "Username and email already exists"
        ) {
          setError("username", {
            type: "manual",
            message: "Username already exists",
          });
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        }
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FieldValues) => {
    setSubmitDisabled(true);
    console.log(data);
    registerUser(data);
    setSubmitDisabled(false);
  };
  return (
    <div className="modalBackground">
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="modalContainer">
          <div className="titleCloseBtn">
            <button
              className="closeBtn"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              <IoMdClose />
            </button>
          </div>
          <div className="title">
            <h1>Create Your Account</h1>
          </div>
          <div className="body">
            <div className="container">
              <div className="mb-2 mt-3">
                <input
                  {...register("username")}
                  className="form-control"
                  placeholder="Username"
                  type="text"
                />
                {errors.username && (
                  <div className="text-danger">{errors.username.message}</div>
                )}
              </div>
              <div className="mb-2">
                <input
                  {...register("displayName")}
                  className="form-control"
                  placeholder="Display Name"
                  type="text"
                />
                {errors.displayName && (
                  <div className="text-danger">
                    {errors.displayName.message}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <input
                  {...register("email")}
                  className="form-control"
                  placeholder="Email"
                  type="text"
                />
                {errors.email && (
                  <div className="text-danger">{errors.email.message}</div>
                )}
              </div>
              <div className="mb-2">
                <input
                  {...register("password")}
                  className="form-control"
                  placeholder="Password"
                  type="password"
                />
                {errors.password && (
                  <div className="text-danger">{errors.password.message}</div>
                )}
              </div>
              <div className="mb-2">
                <input
                  {...register("confirmPassword")}
                  className="form-control"
                  placeholder="Confirm Password"
                  type="password"
                />
                {errors.confirmPassword && (
                  <div className="text-danger">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="footer">
            <button
              disabled={submitDisabled}
              type="submit"
              className="btn btn-dark"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Modal;
