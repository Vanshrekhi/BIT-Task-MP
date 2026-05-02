import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useChangeTaskStageMutation } from "../../redux/slices/api/taskApiSlice";
import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  canManageTasks,
  formatDate,
} from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const STAGE_OPTIONS = [
  { label: "Assigned", value: "todo" },
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
];

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const manage = canManageTasks(user);
  const [changeStage, { isLoading: changingStage }] = useChangeTaskStageMutation();
  const [open, setOpen] = useState(false);
  const isAssignedToMe = (task?.team || []).some(
    (member) => String(member?._id) === String(user?._id)
  );
  const canUpdateStage = manage || isAssignedToMe;

  const handleUpdateStage = async (stage) => {
    try {
      const res = await changeStage({
        id: task?._id,
        stage,
      }).unwrap();
      toast.success(res?.message || "Task stage updated.");
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Unable to update task.");
    }
  };

  return (
    <>
      <div className='w-full h-fit bg-white dark:bg-[#1f1f1f] shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>
          <TaskDialog task={task} />
          {/* {user.isAdmin && <TaskDialog task={task} />} */}
        </div>
        <>
          <div className='flex flex-wrap items-center gap-3'>
            {STAGE_OPTIONS.map((opt) => (
              <label key={opt.value} className='text-xs flex items-center gap-1 text-gray-700 dark:text-gray-300'>
                <input
                  type='checkbox'
                  checked={task?.stage === opt.value}
                  disabled={!canUpdateStage || changingStage}
                  onChange={() => handleUpdateStage(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className='flex items-center gap-2 mt-2'>
            <TaskColor className={TASK_TYPE[task.stage]} />
            <h4 className='text- line-clamp-1 text-black dark:text-white'>
              {task?.title}
            </h4>
          </div>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className='w-full border-t border-gray-200 dark:border-gray-700 my-2' />
        <div className='flex items-center justify-between mb-2'>
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks?.length}
            assets={task?.assets?.length}
          />

          <div className='flex flex-row-reverse'>
            {task?.team?.length > 0 &&
              task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
          </div>
        </div>

        {/* subtasks */}
        {task?.subTasks?.length > 0 ? (
          <div className='py-4 border-t border-gray-200 dark:border-gray-700'>
            <h5 className='text-base line-clamp-1 text-black dark:text-gray-400'>
              {task?.subTasks[0].title}
            </h5>

            <div className='p-4 space-x-8'>
              <span className='text-sm text-gray-600 dark:text-gray-500'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className='bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium'>
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className='py-4 border-t border-gray-200 dark:border-gray-700'>
              <span className='text-gray-500'>No Sub-Task</span>
            </div>
          </div>
        )}

        <div className='w-full pb-2'>
          <div className='flex items-center gap-2'>
            <button
              disabled={!manage}
              onClick={() => setOpen(true)}
              className='flex-1 flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300'
            >
              <IoMdAdd className='text-lg' />
              <span>ADD SUBTASK</span>
            </button>
          </div>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;
