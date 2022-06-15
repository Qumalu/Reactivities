import React, { Fragment } from "react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivitiesRoutes from "../routes/activitiesRoutes";
import ActivitiesDetails from "../../features/activities/details/ActivitiesDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Fragment>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ActivitiesRoutes />}>
          <Route path="/activities" element={<ActivityDashboard />} />
          <Route path="/activities/:id" element={<ActivitiesDetails />} />
          <Route path="/createActivity" element={<ActivityForm />} />
          <Route path="/manage/:id" element={<ActivityForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Fragment>
  );
};

export default observer(App);
