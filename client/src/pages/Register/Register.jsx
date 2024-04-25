import React from "react";
import "./register.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import authimage from "../../Images/authimage.jpg";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { apidomain } from "../../utils/domain";
import { toast } from "react-toastify";
import { toastStyles } from "../../toastConfig";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object().shape({
  username: yup.string().required("Full name is required"),
  email: yup.string().email("email is invalid").required("email is required"),
  role: yup.string().required("role is required"),
  password: yup.string().min(4, "password must be at least 4 characters").required("password is required"),
  Confirmpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match")
    .required("Confirm password is required"),
});

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    Axios.post(`${apidomain}/auth/register`, data)
      .then((response) => {
        response.data.message && toast.success(response.data.message, toastStyles.success);
        navigate("/login");
        // reset();
      })
      .catch(({ response }) => {
        toast.error(response.data.error, toastStyles.error);
      });
    // reset();
  };

  return (
    <div className="registration_page">
      <div className="registration_form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="register_title">REGISTER YOUR ACCOUNT</h3>
          {/* Input username */}
          <>
            <input className="inputFieldLogin" type="text" placeholder="Your username" {...register("username")} />
            <p>{errors.username?.message}</p>
          </>
          <br />
          {/* Input email */}
          <>
            <input className="inputFieldLogin" type="email" placeholder="Your email" {...register("email")} />
            <p>{errors.email?.message}</p>
          </>
          <br />
          {/* Select role */}
          <>
            <label htmlFor="role"></label>
            <select {...register("role")}>
              <option value="">Select Your Role</option>
              <option value="TeamLead">TeamLead</option>
              <option value="Teammate">Teammate</option>
            </select>
            <p>{errors.role?.message}</p>
          </>
          <br />
          {/* Input password */}
          <>
            <input className="inputFieldLogin" type="password" placeholder="Your password" {...register("password")} />
            <p>{errors.password?.message}</p>
          </>
          <br />
          {/* Confirm password */}
          <>
            <input className="inputFieldLogin" type="password" placeholder="Confirm your password" {...register("Confirmpassword")} />
            <p>{errors.Confirmpassword?.message}</p>
          </>
          <br />
          <>
            <input type="submit" value="REGISTER" className="submit_btn" />
          </>
          <br />
        </form>
      </div>
      <div className="registration_image">
        <div className="bg_image">
          <img src={authimage} alt="authimage" />
        </div>
      </div>
    </div>
  );
}

export default Register;
