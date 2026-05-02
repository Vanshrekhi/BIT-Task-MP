import clsx from "clsx";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loading, Title } from "../components";
import { useGetTeamListsQuery } from "../redux/slices/api/userApiSlice";
import { getInitials } from "../utils";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-green-600",
  "bg-red-600",
  "bg-yellow-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
];

const Students = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");
  const { data, isLoading } = useGetTeamListsQuery({
    search: searchTerm,
    role: "Student",
  });

  const students = data || [];

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='w-full md:px-1 px-0'>
      <div className='flex items-center justify-between mb-6'>
        <Title title='Students Section' />
      </div>

      <div className='bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow-md rounded'>
        <div className='mb-3 text-sm text-gray-500'>
          Total students visible: <span className='font-semibold text-gray-700'>{students.length}</span>
        </div>

        {students.length === 0 ? (
          <p className='text-sm text-gray-500 py-4'>No students found for your visibility scope.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='border-b border-gray-300 dark:border-gray-600'>
                <tr className='text-black dark:text-white text-left text-sm'>
                  <th className='py-3 pr-4'>Student</th>
                  <th className='py-3 pr-4'>Department</th>
                  <th className='py-3 pr-4'>Year</th>
                  <th className='py-3 pr-4'>Section</th>
                  <th className='py-3 pr-4'>PRN</th>
                  <th className='py-3'>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student._id}
                    className='border-b border-gray-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  >
                    <td className='p-3'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={clsx(
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold flex-shrink-0",
                            AVATAR_COLORS[index % AVATAR_COLORS.length]
                          )}
                        >
                          {getInitials(student.name)}
                        </div>
                        <p className='font-medium text-gray-800 dark:text-gray-200'>{student.name}</p>
                      </div>
                    </td>
                    <td className='p-3 text-sm'>{student.department || "-"}</td>
                    <td className='p-3 text-sm'>{student.year || "-"}</td>
                    <td className='p-3 text-sm'>{student.section || "-"}</td>
                    <td className='p-3 text-sm'>{student.prn || "-"}</td>
                    <td className='p-3 text-sm'>{student.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
