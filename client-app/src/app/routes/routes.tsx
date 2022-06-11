import { useRoutes } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivitiesDetails from "../../features/activities/details/ActivitiesDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";

const MyRoutes = () => {
  return useRoutes([
    { path: "/activities", element: <ActivityDashboard /> },
    { path: "/activities/:id", element: <ActivitiesDetails /> },
    { path: "/createActivity", element: <ActivityForm /> },
    { path: "/manage/:id", element: <ActivityForm /> },
  ]);
};

export default MyRoutes;
