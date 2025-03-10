"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Replace with your actual calendar component
import Swal from "sweetalert2";
import { createConsultationBooking } from "@/app/_actions/consultation.actions";
import { FaCalendarAlt } from "react-icons/fa";
import { sendMail } from "@/app/_email/mail";

// Define the shape of form data
interface FormDataShape {
  full_names: string;
  email: string;
  phone_number: string;
  date: string;
  time: string;
}

const BookingConsultationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataShape>({
    full_names: "",
    email: "",
    phone_number: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({
    full_names: "",
    email: "",
    phone_number: "",
    date: "",
    time: "",
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataObj = new FormData(event.currentTarget);
    const email = formDataObj.get("email") as string;
    const full_names = formDataObj.get("full_names") as string; // Corrected here

    try {
      if (validateInputs(formDataObj)) {
        const response = await createConsultationBooking(formDataObj);
        if (response) {
          if (response.error) {
            Swal.fire("Error!", response.error, "error");
          } else {
            await sendMail({
              to: email,
              name: full_names,
              subject: "Waiting List Confirmation",
              body: `<h1>Thank you for signing up, ${full_names}!</h1><p>You will be contacted once your request is approved.</p>`,
            });
            Swal.fire(
              "Thank You!",
              "Your consultation request has been received. We will contact you soon.",
              "success"
            );
            setFormData({
              full_names: "",
              email: "",
              phone_number: "",
              date: "",
              time: "",
            });
            router.push("/");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", (error as Error).message);
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

  const handleDateChange = (date: Date) => {
    setFormData({
      ...formData,
      date: date.toISOString().split("T")[0],
    });
    setShowCalendar(false); // Close calendar after selecting a date
  };

  const validateInputs = (formData: FormData) => {
    let isValid = true;
    const newErrors = { full_names: "", email: "", phone_number: "", date: "", time: "" };

    const fullNames = formData.get("full_names");
    const email = formData.get("email");
    const phoneNumber = formData.get("phone_number");
    const date = formData.get("date");
    const time = formData.get("time");

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

    if (!date) {
      newErrors.date = "Date is required.";
      isValid = false;
    }

    if (!time) {
      newErrors.time = "Time is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <section id="form">
      <form onSubmit={handleSubmit}>
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

            <div className="flex flex-col gap-3">
              <label htmlFor="date" className="font-semibold text-xl">
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="date"
                  placeholder="Select a date"
                  className="py-2 px-4 text-black pr-10"
                  value={formData.date}
                  onChange={handleChange}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="absolute right-2 top-2 flex items-center"
                  aria-label="Open calendar"
                >
                  <FaCalendarAlt size={20} />
                </button>
                {showCalendar && (
                  <div className="absolute z-10 bg-white shadow-lg text-black mt-1">
                    <Calendar
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onDayClick={handleDateChange}
                    />
                  </div>
                )}
              </div>
              {errors.date && <p className="text-red-500">{errors.date}</p>}
            </div>


            <div className="flex flex-col gap-3">
              <label htmlFor="time" className="font-semibold text-xl">
                Time
              </label>
              <input
                name="time"
                className="py-2 px-4 text-black"
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && <p className="text-red-500">{errors.time}</p>}
            </div>
          </div>
          <div>
            <Button className="bg-[#ff0000] p-2 text-center text-xl w-full">
              Book Consultation
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default BookingConsultationForm;
