import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { app } from "../../utils/firebase";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];
const TASK_TYPES = [
  "Assignment",
  "Examination and Evaluation Task",
  "Administrative Task",
  "Faculty Task",
  "Student Task",
];
const RECURRING_OPTIONS = ["Non recurring", "Monthly", "Weekly", "After 15 days"];

const getRecurrenceLabel = (days) => {
  const map = { 30: "Monthly", 7: "Weekly", 15: "After 15 days" };
  return map[days] || "Non recurring";
};

const getRecurrenceDays = (label) => {
  const map = { Monthly: 30, Weekly: 7, "After 15 days": 15 };
  return map[label] || null;
};

const uploadedFileURLs = [];

const uploadFile = async (file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

const AddTask = ({ open, setOpen, task }) => {
  const defaultValues = {
    title: task?.title || "",
    description: task?.description || "",
    taskType: task?.taskType || TASK_TYPES[0],
    recurrenceOption: task?.isRecurring ? getRecurrenceLabel(task.recurrenceIntervalDays) : "Non recurring",
    startDate: dateFormatter(task?.startDate || task?.date || new Date()),
    endDate: dateFormatter(task?.endDate || task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const recurrenceOption = watch("recurrenceOption");
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const URLS = task?.assets ? [...task.assets] : [];

  const handleOnSubmit = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const recurrenceIntervalDays = getRecurrenceDays(data.recurrenceOption);
      const newData = {
        ...data,
        isRecurring: data.recurrenceOption !== "Non recurring",
        recurrenceIntervalDays,
        assets: [...URLS, ...uploadedFileURLs],
        team,
        stage,
        priority,
      };

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <div className='flex flex-col gap-4'>
              <div className='w-full'>
                <label className='text-slate-900'>Task Description</label>
                <textarea
                  rows={4}
                  className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-blue-300'
                  {...register("description", {
                    required: "Description is required!",
                  })}
                  placeholder='Write a detailed task description or message'
                />
                {errors.description && (
                  <span className='text-xs text-[#f64949fe] mt-0.5'>
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
            <UserList setTeam={setTeam} team={team} />
            <div className='grid gap-4 md:grid-cols-3'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
              <div className='w-full'>
                <span className='text-sm text-slate-900'>Task Type</span>
                <select
                  className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-blue-300'
                  {...register("taskType", { required: "Task type is required!" })}
                >
                  {TASK_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.taskType && (
                  <span className='text-xs text-[#f64949fe] mt-0.5'>
                    {errors.taskType.message}
                  </span>
                )}
              </div>
            </div>
            <div className='grid gap-4 md:grid-cols-3'>
              <Textbox
                placeholder='Start date'
                type='date'
                name='startDate'
                label='Task Start Date'
                className='w-full rounded'
                register={register("startDate", {
                  required: "Start date is required!",
                })}
                error={errors.startDate ? errors.startDate.message : ""}
              />
              <Textbox
                placeholder='End date'
                type='date'
                name='endDate'
                label='Task End Date'
                className='w-full rounded'
                register={register("endDate", {
                  required: "End date is required!",
                })}
                error={errors.endDate ? errors.endDate.message : ""}
              />
              <div className='w-full'>
                <span className='text-sm text-slate-900'>Recurrence</span>
                <select
                  className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 ring-blue-300'
                  {...register("recurrenceOption")}
                >
                  {RECURRING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='w-full flex items-center justify-center mt-4'>
              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                htmlFor='imgUpload'
              >
                <input
                  type='file'
                  className='hidden'
                  id='imgUpload'
                  onChange={(e) => handleSelect(e)}
                  accept='.jpg, .png, .jpeg'
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          {isLoading || isUpdating || uploading ? (
            <div className='py-4'>
              <Loading />
            </div>
          ) : (
            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              <Button
                label='Submit'
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
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

export default AddTask;
