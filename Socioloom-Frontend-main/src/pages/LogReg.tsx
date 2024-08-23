import { FieldValues, useForm } from "react-hook-form";
import "./LogReg.css";
import Modal from "../Components/RegisterModal";
import { useContext, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoggedContext } from "../App";

function LogReg() {
  const login = useContext(LoggedContext);
  const navigate = useNavigate();

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const loginUser = (data: FieldValues) => {
    axios
      .post("http://localhost:3000/api/auth/login", data)
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
        if (err.response.data.message === "Wrong email/username") {
          setError("email_username", {
            type: "manual",
            message: "Wrong email/username",
          });
        } else if (err.response.data.message === "Wrong password") {
          setError("password", {
            type: "manual",
            message: "Wrong password",
          });
        }
      });
  };

  const onSubmit = (data: FieldValues) => {
    setSubmitDisabled(true);
    console.log(data);
    loginUser(data);
    setSubmitDisabled(false);
  };
  const [openModal, setOpenModal] = useState(false);
  const schema = z.object({
    email_username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  });
  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <>
      <div className="container-sm">
        <div className="m-5">
          <div className="row mainContent">
            <div className="off col-lg-6 text-lg-start text-center header">
              <h1 className="sc-title">SocioLoom</h1>
              <h3 className="mb-5">A different approach to Social Media</h3>
            </div>
            <div className="col-lg-6 form-area">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 mt-3">
                  <input
                    className="form-control"
                    placeholder="Email address or Username"
                    {...register("email_username")}
                    type="text"
                  />
                  {errors.email_username && (
                    <div className="text-danger">
                      {errors.email_username.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    {...register("password")}
                    placeholder="Password"
                    type="password"
                  />
                  {errors.password && (
                    <div className="text-danger">{errors.password.message}</div>
                  )}
                </div>
                <div className="pb-3 border-bottom">
                  <button
                    disabled={submitDisabled}
                    className="btn btn-primary container"
                    type="submit"
                  >
                    Log in
                  </button>
                </div>
              </form>
              <div className="mb-3 mt-3">
                <button
                  className="btn btn-success container"
                  type="submit"
                  onClick={() => setOpenModal(true)}
                >
                  Create new account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </>
  );
}

export default LogReg;
