import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useUpdateUserMutation, useCreateManagedUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { Button, Loading, ModalWrapper, Textbox } from "./";

const ROLES_BY_CREATOR = {
  Admin: ["Principal", "HOD"],
  Principal: ["HOD"],
  HOD: ["Faculty"],
  Faculty: ["Student"],
};

const DEPARTMENTS = ["COMP", "IT", "ENTC", "MECH", "CIVIL", "OTHER"];
const YEARS = ["FE", "SE", "TE", "BE"];
const FACULTY_ROLES = ["Faculty", "Student Incharge", "Project Guide"];

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const dispatch = useDispatch();

  const [createManagedUser, { isLoading }] = useCreateManagedUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        const res = await updateUser(data).unwrap();
        toast.success(res?.message);
        if (userData?._id === user?._id) {
          dispatch(setCredentials({ ...res?.user }));
        }
      } else {
        const password = (data?.password || data?.email || data?.prn || "").trim();
        if (!password) {
          toast.error("Email or PRN is required to generate a password.");
          return;
        }

        await createManagedUser({
          ...data,
          password,
        }).unwrap();
        toast.success("User created successfully");
      }

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const creatorRole = user?.isAdmin ? "Admin" : user?.role;
  const allowedRoles = userData
    ? []
    : ROLES_BY_CREATOR[String(creatorRole || "").trim()] || [];

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />

            {!userData && (
              <div className='w-full flex flex-col gap-1'>
                <span className='text-sm text-slate-900'>Role</span>
                <select
                  className='border border-gray-300 rounded px-2 py-2 text-sm outline-none focus:ring-2 ring-blue-300'
                  {...register("role", { required: "User role is required!" })}
                >
                  <option value=''>Select</option>
                  {allowedRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className='text-xs text-[#f64949fe]'>{errors.role.message}</span>
                )}
                {allowedRoles.length === 0 && (
                  <span className='text-xs text-gray-500'>
                    Your role cannot create new users.
                  </span>
                )}
              </div>
            )}

            {/* For updates, keep role editable like before */}
            {userData && (
              <Textbox
                placeholder='Role'
                type='text'
                name='role'
                label='Role'
                className='w-full rounded'
                register={register("role", {
                  required: "User role is required!",
                })}
                error={errors.role ? errors.role.message : ""}
              />
            )}

            {/* Email (required for Faculty/HOD/Principal; optional for Student) */}
            <Textbox
              placeholder='Email Address (optional for Student)'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={register("email")}
              error={errors.email ? errors.email.message : ""}
            />

            {/* Department */}
            {!userData && (
              <div className='w-full flex flex-col gap-1'>
                <span className='text-sm text-slate-900'>Department</span>
                <select
                  className='border border-gray-300 rounded px-2 py-2 text-sm outline-none focus:ring-2 ring-blue-300 disabled:bg-gray-50'
                  {...register("department")}
                  defaultValue={user?.department || ""}
                  disabled={creatorRole === "HOD" || creatorRole === "Faculty"}
                >
                  <option value=''>Select</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Student fields */}
            {!userData && creatorRole === "Faculty" && (
              <>
                <Textbox
                  placeholder='PRN'
                  type='text'
                  name='prn'
                  label='PRN'
                  className='w-full rounded'
                  register={register("prn", { required: "PRN is required!" })}
                  error={errors.prn ? errors.prn.message : ""}
                />

                <div className='grid grid-cols-2 gap-2'>
                  <div className='w-full flex flex-col gap-1'>
                    <span className='text-sm text-slate-900'>Year</span>
                    <select
                      className='border border-gray-300 rounded px-2 py-2 text-sm outline-none focus:ring-2 ring-blue-300'
                      {...register("year", { required: "Year is required!" })}
                    >
                      <option value=''>Select</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <span className='text-xs text-[#f64949fe]'>{errors.year.message}</span>
                    )}
                  </div>

                  <Textbox
                    placeholder='Section'
                    type='text'
                    name='section'
                    label='Section'
                    className='w-full rounded'
                    register={register("section")}
                    error={errors.section ? errors.section.message : ""}
                  />
                </div>

                <Textbox
                  placeholder='Roll No'
                  type='text'
                  name='rollNo'
                  label='Roll No'
                  className='w-full rounded'
                  register={register("rollNo", { required: "Roll No is required!" })}
                  error={errors.rollNo ? errors.rollNo.message : ""}
                />
              </>
            )}

            {/* Faculty fields */}
            {!userData && creatorRole === "HOD" && (
              <>
                <Textbox
                  placeholder='Subjects / Skills (comma separated)'
                  type='text'
                  name='subjectsSkills'
                  label='Subjects / Skills'
                  className='w-full rounded'
                  register={register("subjectsSkills", {
                    required: "Subjects / Skills is required!",
                  })}
                  error={errors.subjectsSkills ? errors.subjectsSkills.message : ""}
                />

                <div className='w-full flex flex-col gap-1'>
                  <span className='text-sm text-slate-900'>Faculty Role</span>
                  <select
                    className='border border-gray-300 rounded px-2 py-2 text-sm outline-none focus:ring-2 ring-blue-300'
                    {...register("facultyRole", { required: "Faculty role is required!" })}
                  >
                    <option value=''>Select</option>
                    {FACULTY_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.facultyRole && (
                    <span className='text-xs text-[#f64949fe]'>{errors.facultyRole.message}</span>
                  )}
                </div>
              </>
            )}
          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
