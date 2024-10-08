"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContextProvider";
import axios from "axios";

function Signup() {
  const [session, setSession] = useState(false);
  const router = useRouter();

  // get form data

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/");
    }
  }, []);

  const handleSignup = async (e) => {
    setSession(true);
    e.preventDefault();

    const formData = new FormData(e.target);

    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const phoneNumber = formData.get("phone_number");
    const age = parseInt(formData.get("age"));
    const email = formData.get("email");
    const password = formData.get("password");
    const learning_rate = "Active";

    const role = "Student";

    const communication_format = "Textbook";
    const tone_style = "Neutral";

    // send data to server using axios

    try {
      console.log("password", password);
      const response = await axios.post("http://localhost:8000/signup", {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        age,
        learning_rate,
        role,
        communication_format,
        tone_style,
        email,
        password,
      });

      const token = response.data.access_token;
      const user = response.data.user_id;

      console.log("token", token);

      localStorage.setItem("token", token);
      router.push(`/chats/`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 w-screen bg-blue-900">
      <div className=" overflow-hidden opacity-70 hidden md:block">
        <img className="w-full h-full" src="/login.webp" alt="login image" />
      </div>
      <div>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-5  items-center justify-center h-screen">
            <h1 className="text-xl font-bold text-white">Welcome to</h1>
            <h1 className="text-5xl animate-bounce font-bold text-white">
              Obo Tutor
            </h1>

            <input
              className="w-80 p-2 rounded-xl focus:outline-none outline-none active:outline-none"
              type="text"
              placeholder="First Name"
              name="first_name"
            />
            <input
              className="w-80 p-2 rounded-xl focus:outline-none outline-none active:outline-none"
              type="text"
              placeholder="Last Name"
              name="last_name"
            />
            {/* add phone number with country code  but need to add pull list*/}
            <input
              className="w-80 p-2 rounded-xl focus:outline-none outline-none active:outline-none"
              type="text"
              placeholder="Phone Number (07********)  "
              name="phone_number"
            />
            <input
              className="w-80 p-2 rounded-xl focus:outline-none outline-none active:outline-none"
              type="text"
              placeholder="Age"
              name="age"
            />

            <input
              className="w-80 p-2 rounded-xl focus:outline-none outline-none active:outline-none"
              type="text"
              placeholder="Email"
              name="email"
            />
            <input
              name="password"
              className="w-80 p-2 rounded-xl focus:outline-none outline-none active:outline-none"
              type="password"
              placeholder="Password"
            />

            <button
              type="submit"
              className="w-80 p-2 animate-pulse hover:bg-blue-950 bg-blue-500 rounded-xl text-white"
            >
              Sign Up
            </button>

            <p className="text-white text-center">
              Already have an account?{" "}
              <Link href="/">
                <span className="text-blue-300 cursor-pointer hover:text-blue-500">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
