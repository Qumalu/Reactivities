import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Item, Button, Label, Segment, Icon } from "semantic-ui-react";
import { IActivitiy } from "../../../app/models/activitiy";
import ActivityStore from "../../../app/stores/activityStore";

export const ActivityListItem: React.FC<{ activity: IActivitiy }> = ({
  activity,
}) => {
  // Activity store variable
  const activityStore = useContext(ActivityStore);
  // Destructure store props for usage
  const { deleteActivity, submitting, target } = activityStore;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circural="true" src="/assets/user.png" />
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {activity.date}
        <Icon name="marker" /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>Attendee will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
        <Button
          name={activity.id}
          loading={target === activity.id && submitting}
          onClick={(e) => deleteActivity(e, activity.id)}
          floated="right"
          content="Delete"
          color="red"
        />
        <Label basic content={activity.category} />
      </Segment>
    </Segment.Group>
  );
};
