import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Grid, GridColumn, Segment } from "semantic-ui-react";
import { IActivitiy } from "../../../app/models/activitiy";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  // Activity Data Store variable
  const activityStore = useContext(ActivityStore);
  // Destructure store props for usage
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  // Hook that sets the state for form component for updating activity
  useEffect(() => {
    if (params.id) {
      loadActivity(params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [loadActivity, clearActivity, params.id, initialFormState]);

  // Hook that alows us to change component state based on route location, used for reseting form component when going from updating to creating
  useEffect(() => {
    setActivity({
      id: "",
      title: "",
      category: "",
      description: "",
      date: "",
      city: "",
      venue: "",
    });
  }, [location]);

  const [activitiy, setActivity] = useState<IActivitiy>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  const handleSubmit = () => {
    if (activitiy.id.length === 0) {
      let newActivity = {
        ...activitiy,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        navigate(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activitiy).then(() =>
        navigate(`/activities/${activitiy.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activitiy, [name]: value });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        {" "}
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              onChange={handleInputChange}
              name="title"
              placeholder="Title"
              value={activitiy.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name="description"
              rows={2}
              placeholder="Description"
              value={activitiy.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name="category"
              placeholder="Category"
              value={activitiy.category}
            />
            <Form.Input
              onChange={handleInputChange}
              name="date"
              type="datetime-local"
              placeholder="Date"
              value={activitiy.date}
            />
            <Form.Input
              onChange={handleInputChange}
              name="city"
              placeholder="City"
              value={activitiy.city}
            />
            <Form.Input
              onChange={handleInputChange}
              name="venue"
              placeholder="Venue"
              value={activitiy.venue}
            />
            <Button
              loading={submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={() => navigate("/activities")}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
