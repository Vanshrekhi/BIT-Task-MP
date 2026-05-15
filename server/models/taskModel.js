import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, trim: true, default: "" },
    taskType: {
      type: String,
      default: "Assignment",
      enum: [
        "Assignment",
        "Examination and Evaluation Task",
        "Administrative Task",
        "Faculty Task",
        "Student Task",
      ],
    },
    isRecurring: { type: Boolean, default: false },
    recurrenceIntervalDays: { type: Number, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    date: { type: Date, default: new Date() },
    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: [
            "assigned",
            "started",
            "in progress",
            "bug",
            "completed",
            "commented",
          ],
        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    subTasks: [
      {
        title: String,
        date: Date,
        tag: String,
      },
    ],
    assets: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reminderMeta: {
      lastReminderSentAt: { type: Date, default: null },
      lastEscalationSentAt: { type: Date, default: null },
      lastRecurrenceCreatedAt: { type: Date, default: null },
    },
    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
