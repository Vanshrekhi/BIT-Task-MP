import Dashboard from "./Dashboard";
import PendingApprovalsPanel from "../components/PendingApprovalsPanel";

const FacultyDashboard = () => {
  return (
    <div className='flex flex-col gap-3'>
      <PendingApprovalsPanel title='Student approval requests' />
      <Dashboard />
    </div>
  );
};

export default FacultyDashboard;

