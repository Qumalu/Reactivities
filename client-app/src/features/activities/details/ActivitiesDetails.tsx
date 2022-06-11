import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ActivitiesDetails: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Activity store variable
  const activityStore = useContext(ActivityStore);
  // Destructure store props for usage
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(params.id!);
  }, [loadActivity]);

  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading activity..." />;

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date.toString()}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => navigate("/activities")}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivitiesDetails);
