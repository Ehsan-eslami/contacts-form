import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Frontend Mentor | Contact form" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    queryType: formData.get("queryType"),
    message: formData.get("message"),
    consent: formData.get("consent") === "on",
  };

  const formSchema = z.object({
    firstName: z.string().min(2, "*First Name must be at least 2 characters long"),
    lastName: z.string().min(2, "*Last Name must be at least 2 characters long"),
    email: z.string().email("*Invalid email address"),
    queryType: z.string(),
    message: z.string().min(1, "*Message cannot be empty"),
    consent: z.boolean().refine(value => value === true, "*Consent is required"),
  });

  const validationResult = formSchema.safeParse(data);

  if (!validationResult.success) {
    return { errors: validationResult.error.formErrors.fieldErrors };
  }

  return data;
};

export default function Index() {
  const [selected, setSelected] = useState("general");
  const [popUp, setPopUp] = useState(false)
  const actionData = useActionData<typeof action>();

  return (
    <>
      <Form method="post" className="bg-white p-5 rounded-lg">
        <h1 className="text-left font-semibold text-xl">Contact Us</h1>
        <br />
        <div className="md:grid flex-col grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">
              First Name
              <span className="text-red-700">*</span>
            </label>
            <FormInput
              type="text" 
              name="firstName" 
              errors={actionData?.errors}  
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">
              Last Name
              <span className="text-red-700">*</span>
            </label>
            <FormInput
              type="text" 
              name="lastName" 
              errors={actionData?.errors}  
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs text-slate-500">
              Email
              <span className="text-red-700">*</span>
            </label>
            <FormInput
              type="email" 
              name="email" 
              errors={actionData?.errors}  
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-slate-500" htmlFor="queryType">
              Query Type
              <span className="text-red-700">*</span>
            </label>
            <input type="hidden" name="queryType" value={selected} />
            <div className="flex justify-between gap-x-1">
              <button
                type="button"
                onClick={() => setSelected("general")}
                className={`py-[6px] px-2 border w-1/2 rounded-md text-sm ${
                  selected === "general" ? "bg-gray-500 text-white" : "bg-white text-black"
                }`}
              >
                General Enquiry
              </button>
              <button
                type="button"
                onClick={() => setSelected("support")}
                className={`py-[6px] px-2 border w-1/2 rounded-md text-sm ${
                  selected === "support" ? "bg-gray-500 text-white" : "bg-white text-black"
                }`}
              >
                Support Request
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs text-slate-500">
              Message
              <span className="text-red-700">*</span>
            </label>
            <textarea
              name="message"
              className="border border-slate-300 rounded-md py-1 px-2 hover:bg-slate-50 hover:cursor-pointer"
            ></textarea>
            {actionData?.errors?.message && (
              <ul>
                {actionData.errors.message.map((error: string) => (
                  <li key={error} className="text-xs text-red-700">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex col-span-2 gap-2">
            <input type="checkbox" name="consent" className="cursor-pointer" />
            <p className="cursor-default text-[10px] text-slate-500">
              I consent to being contacted by the team
              <span className="text-red-700">*</span>
            </p>
            {actionData?.errors?.consent && (
              <ul>
                {actionData.errors.consent.map((error: string) => (
                  <li key={error} className="text-xs text-red-700">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-2 flex justify-center">
            <button
              className="bg-gray-800 text-white py-1 px-2 w-full rounded-md hover:bg-gray-700"
              type="submit"
              onClick={() => setPopUp(true)}
            >
              Submit
            </button>
          </div>
        </div>
      </Form>
      {popUp && actionData && !actionData.errors && (
        <>
          <div
            className="fixed top-0 left-0 h-screen w-screen bg-slate-900 opacity-50"
            onClick={() => setPopUp(false)}
          ></div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="bg-gray-700 rounded-md p-5 text-white">
              <h1 className="font-semibold text-center">Form Submission Received</h1>
              <div className="bg-slate-200 w-full h-[1px] my-2"></div>
              <table border="1">
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
                <tr>
                  <td>First Name:</td>
                  <td className="text-center">{actionData.firstName}</td>
                </tr>
                <tr>
                  <td>Last Name:</td>
                  <td className="text-center">{actionData.lastName}</td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td className="text-center">{actionData.email}</td>
                </tr>
                <tr>
                  <td>Query Type:</td>
                  <td className="text-center">{actionData.queryType}</td>
                </tr>
                <tr>
                  <td>Message:</td>
                  <td className="text-center">{actionData.message}</td>
                </tr>
                <tr>
                  <td>Consent:</td>
                  <td className="text-center">{actionData.consent ? "Yes" : "No"}</td>
                </tr>
              </table>
              <button
                className="mt-4 bg-gray-800 text-white py-1 px-2 rounded-md hover:bg-gray-700"
                onClick={() => setPopUp(false)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
      <br />
      <br />
      <div className="">
        Challenge by <a className="text-blue-600 underline" href="https://www.frontendmentor.io?ref=challenge">Frontend Mentor</a>. 
        Coded by <a className="text-blue-600 underline" href="https://www.frontendmentor.io/profile/Ehsan-eslami">EhsanEslami</a>.
      </div>
    </>
  );
}

// FormInput component for rendering form inputs
function FormInput({
  type,
  name,
  label,
  errors,
}: Readonly<{
  type: string;
  name: string;
  label?: string;
  errors?: any;
}>) {
  return (
    <div className="input-field">
      <div>
        <label htmlFor={name}>{label}</label>
        <div>
          <input
            className="w-full border border-slate-300 rounded-md py-1 px-2 hover:bg-slate-50 hover:cursor-pointer"
            name={name}
            type={type}
          />
        </div>
      </div>
      <ul>
        {errors && errors[name]
          ? errors[name].map((error: string) => (
              <li key={error} className="text-xs text-red-700">
                {error}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
