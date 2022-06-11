import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";

const ActivitiesRoutes = () => {
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Outlet />
      </Container>
    </Fragment>
  );
};

export default ActivitiesRoutes;
