import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

const SupplerRegisterForm = () => {
  return (
    <section>
      <div className="border rounded-md mt-4 p-3 ">
        <form action="" className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Email*"
            className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
          />
          <div className="flex ">
            <Input
              type="text"
              placeholder="Surname*"
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
            <Input
              type="text"
              placeholder="Other Names*"
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
          </div>

          <Input
            type="text"
            placeholder="Phone number*"
            className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
          />
          <Input
            type="text"
            placeholder="Full Business Name*"
            className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
          />
          <h1 className="font-bold">Business Premises/Contacts*</h1>
          <div className="pl-8">
            <Input
              type="text"
              placeholder="Street/Place..."
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
            <Input
              type="text"
              placeholder="Town..."
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
            <Input
              type="text"
              placeholder="Business phone number..."
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
            <Input
              type="text"
              placeholder="Business email..."
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
          </div>
          <div>
            <h1 className="font-bold"> Face Image</h1>
            <Input
              type="file"
              placeholder="Face Image*"
              className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
            />
          </div>
          <Input
            type="password"
            placeholder="Password*"
            className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
          />

          <Input
            type="password"
            placeholder="Confirm Password*"
            className=" border-t-0 border-l-0 border-r-0 border-black/20 pl-0"
          />
          <Button className=" bg-blue-600 text-white hover:bg-blue-800 transition-all hover:text-lg">
            Register
          </Button>
        </form>
        <div className="mt-6 mb-3">
          <h1 className=" text-end">
            Already have an account? Please{" "}
            <span className="font-bold underline text-blue-600">
              <Link href={"/sign-in"}>sign-in</Link>
            </span>
          </h1>
        </div>
        <div className="flex items-center mt-3 text-sm border-t py-1">
          <p>* = required field</p>
        </div>
      </div>
    </section>
  );
};

export default SupplerRegisterForm;