import React from "react";
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Button,
} from "reactstrap";

export const PrinterCard = ({
  id,
  name,
  redis,
  type,
  width,
  height,
  dialect,
  inUse,
  setAsDefault,
}) => {
  const typeName = (x) => {
    switch (x) {
      case 0:
        return "Undefined";
      case 1:
        return "STDOUT";
      case 2:
        return "'Testing'";
      case 3:
        return "'Static Address'";
    }
  };
  const dialectName = (x) => {
    switch (x) {
      case 0:
        return "Undefined";
      case 1:
        return "ZPL";
      case 2:
        return "JSON";
    }
  };
  return (
    <Col>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            <Row>
              <Col>{`${name}`}</Col>
              <Col className="text-muted text-right">{`(#${id})`}</Col>
            </Row>
          </CardTitle>
          <CardSubtitle style={{ color: "grey" }} tag="h6">
            {`A ${typeName(type)} printer`}
          </CardSubtitle>
          <hr />
          <CardText>{`Listening to the '${redis}' redis channel`}</CardText>
          <CardText>{`Printing format '${width}x${height}'`}</CardText>
          <CardText>{`Dialect '${dialectName(dialect)}'`}</CardText>
          {inUse ? (
            <Button disabled>{`This printer is already in use`}</Button>
          ) : (
            <Button onClick={setAsDefault}>{`Use this printer`}</Button>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};