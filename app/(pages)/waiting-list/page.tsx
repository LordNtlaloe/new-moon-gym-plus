"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { createWaitingList } from "@/app/_actions/bookings.actions";
import { sendMail } from "@/app/_email/mail";


const WaitingListForm = () => {
  const router = useRouter(); // Initialize the router
  const [formData, setFormData] = useState({
    full_names: "",
    email: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({
    full_names: "",
    email: "",
    phone_number: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formDataObj = new FormData(event.currentTarget); // Create FormData from the form
    const email = formDataObj.get("email") as string;
    const full_names = formDataObj.get("full_namess") as string
    try {
      if (validateInputs(formDataObj)) {
        const response = await createWaitingList(formDataObj);
        if (response) {
          if (response.error) {
            Swal.fire("Error!", response.error, "error");
          } else {
            await sendMail({
              to: email,
              name: full_names,
              subject: "Waiting List Confirmation",
              body: `<h1>Thank you for signing up, ${full_names}!</h1><p>You will be contacted once your request is approved.</p>`,
            })
            Swal.fire(
              "Thank You!",
              "Thank you for signing up for our waiting list. You will be contacted once your request is approved.",
              "success"
            );
            setFormData({
              full_names: "",
              email: "",
              phone_number: "",
            });
            router.push("/"); // Redirect to home page after successful submission
          }
        }
      }
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      Swal.fire("Error!", "There was an issue submitting your form", "error");
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateInputs = (formData: FormData) => {
    let isValid = true;
    const newErrors = { full_names: "", email: "", phone_number: "" };

    const fullNames = formData.get("full_names");
    const email = formData.get("email");
    const phoneNumber = formData.get("phone_number");

    if (!fullNames) {
      newErrors.full_names = "Full Name is required.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email as string)) {
      newErrors.email = "A valid email is required.";
      isValid = false;
    }

    if (!phoneNumber) {
      newErrors.phone_number = "A valid phone number is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <section id="form">
      <form onSubmit={handleSubmit}> {/* Use onSubmit instead of action */}
        <div className="max-w-xl my-16 mx-8 lg:mx-auto p-8 lg:px-12 lg:py-16 bg-black text-white space-y-10">
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="full_names" className="font-semibold text-xl">
                Full Name
              </label>
              <input
                type="text"
                name="full_names"
                placeholder="Your Full Name"
                className="py-2 px-4 text-black"
                value={formData.full_names}
                onChange={handleChange}
              />
              {errors.full_names && (
                <p className="text-red-500">{errors.full_names}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="font-semibold text-xl">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your_email@gmail.com"
                className="py-2 px-4 text-black"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="phone_number" className="font-semibold text-xl">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                placeholder="+266 5812 3456"
                className="py-2 px-4 text-black"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <p className="text-red-500">{errors.phone_number}</p>
              )}
            </div>
          </div>
          <div>
            <Button className="bg-[#ff0000] p-2 text-center text-xl w-full">
              Sign Up For Waiting List
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default WaitingListForm;
