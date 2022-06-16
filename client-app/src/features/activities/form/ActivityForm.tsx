import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activitiy";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/CategoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import MyTimeInput from "../../../app/common/form/MyTimeInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import { v4 as uuid } from "uuid";
import {
  combineValidators,
  composeValidators,
  hasLengthGreaterThan,
  isRequired,
} from "revalidate";

const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired("Category"),
  description: composeValidators(
    isRequired("Description"),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 characters",
    })
  )(),
  city: isRequired("City"),
  venue: isRequired("Venue"),
  date: isRequired("Date"),
  time: isRequired("Time"),
});

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
  const { createActivity, editActivity, submitting, loadActivity } =
    activityStore;

  const [loading, setLoading] = useState(false);

  // Hook that sets the state for form component for updating activity
  useEffect(() => {
    if (params.id) {
      setLoading(true);
      loadActivity(params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, params.id]);

  // Hook that alows us to change component state based on route location, used for reseting form component when going from updating to creating
  useEffect(() => {
    setActivity({
      id: "",
      title: "",
      category: "",
      description: "",
      date: undefined,
      city: "",
      venue: "",
    });
  }, [location]);

  const [activity, setActivity] = useState(new ActivityFormValues());

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        {" "}
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  rows={3}
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                <Form.Group widths="equal">
                  <Field<Date>
                    name="date"
                    placeholder="Date"
                    value={activity.date}
                    date="true"
                    component={DateInput}
                  />
                  <Field<Date>
                    name="time"
                    placeholder="Time"
                    value={activity.time}
                    time="true"
                    component={MyTimeInput}
                    className="w-2/5 mt-0"
                    use12HourClock
                  />
                </Form.Group>

                <Field
                  component={TextInput}
                  name="city"
                  placeholder="City"
                  value={activity.city}
                />
                <Field
                  component={TextInput}
                  name="venue"
                  placeholder="Venue"
                  value={activity.venue}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  onClick={
                    activity.id
                      ? () => navigate(`/activities/${activity.id}`)
                      : () => navigate("/activities")
                  }
                  disabled={loading}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
