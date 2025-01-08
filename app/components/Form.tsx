import { useForm } from "react-hook-form";
import { FormData, UserSchema, ValidFieldNames } from "@/types";
import FormField from "./FormField";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import { fields } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema), // Apply the zodResolver
  }
  );

  const onSubmit = async (data: FormData) => {
      console.log("SUCCESS", data);
      try{
        const response=await axios.post("/api/form",data)  //Make a Post request 
        const {errors={}}=response.data  // Destructure the 'errors' property from the response data

        const fieldErrorMapping:Record<string,ValidFieldNames>={
         email: "email",
         githubUrl:"githubUrl",
         yearsOfExperience:"yearsOfExperience",
         password:"password",
         confirmPassword:"confirmPassword"
        }
        const fieldWithError=Object.keys(fieldErrorMapping).find((field)=>errors[field])

        if (fieldWithError){
          setError(fieldErrorMapping[fieldWithError],{
            type:"server",
            message:errors[fieldWithError]
          })
        }
      }
      catch(error){
        alert("Submitting form failed")
      }
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto">
          <h1 className="text-3xl font-bold mb-4">
            Zod & React-Hook-Form
          </h1>
          <FormField
            type="email"
            placeholder="Email"
            name="email"
            register={register}
            error={errors.email}
          />

          <FormField
            type="text"
            placeholder="GitHub URL"
            name="githubUrl"
            register={register}
            error={errors.githubUrl}
          />

          <FormField
            type="number"
            placeholder="Years of Experience (1 - 10)"
            name="yearsOfExperience"
            register={register}
            error={errors.yearsOfExperience}
            valueAsNumber
          />

          <FormField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />

          <FormField
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
  );
}

export default Form;