import React from "react";
import { ScannerType, ScannerMode } from "../../models/Scanner";
import { Field, AvailableField } from "../Field";
import { ExpandIcon } from "../Icon";
import { timeSince } from "../../utils/datetime";
import {
  Button,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
  ListGroup,
} from "reactstrap";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Table,
} from "reactstrap";

const typeName = (x) => {
  switch (x) {
    case ScannerType.Undefined:
      return "Undefined";
    case ScannerType.Debug:
      return "'Debug'";
    case ScannerType.Testing:
      return "'testing'";
    case ScannerType.Serial:
      return "'Serial'";
    case ScannerType.USB:
      return "'USB'";
  }
};
const modeName = (x) => {
  switch (x) {
    case ScannerMode.Print:
      return "Print mode";
    case ScannerMode.Inventory:
      return "Inventory mode";
    default:
      return "Undefined";
  }
};

const TransactionTable = ({ fetch, transactions }) => {
  React.useEffect(() => fetch(), []);

  if (!Array.isArray(transactions)) {
    return null;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Value</th>
          <th>Mode</th>
          <th>quantity</th>
          <th>Moment</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((x) => (
          <tr>
            <th>{x.id}</th>
            <th>{x.value}</th>
            <th>{modeName(x.mode)}</th>
            <th>{x.quantity}</th>
            <th>{x.created_at}</th>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const TransactionModal = ({ fetch, transactions }) => {
  const [modal, setModal] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const toggle = () => setModal(!modal);

  return (
    <>
      <Button
        color="light"
        className="mr-2"
        onClick={toggle}
        id="Tooltip-add-part"
      >
        Transactions
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-add-part"
        toggle={toggleTooltip}
      >
        {"Check the transaction history for this scanner"}
      </Tooltip>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{"Create new single part"}</ModalHeader>
        <ModalBody>
          <TransactionTable fetch={fetch} transactions={transactions} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const ScannerCard = ({
  id,
  mode,
  name,
  redis,
  available,
  type,
  settings,
  created_at,
  updated_at,
  transactions,
  fetchDetail,
}) => {
  const [detail, setDetail] = React.useState(false);
  const toggleDetail = () => setDetail(!detail);
  const typeSettings = (x, settings) => {
    switch (x) {
      case ScannerMode.Serial:
      case ScannerMode.USB:
        return <Field title="Device" content={settings.path} />;
      default:
        return;
    }
  };

  return (
    <Col>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            <Row>
              <Col>{`${name}`}</Col>
              <Col className="text-right">
                <Button
                  outline={detail}
                  style={{ marginRight: "-10px" }}
                  color="link"
                  onClick={toggleDetail}
                >
                  <ExpandIcon />
                </Button>
              </Col>
            </Row>
          </CardTitle>
          <CardSubtitle style={{ color: "grey" }} tag="h6">
            <Row>
              <AvailableField available={available} />
              <Col
                style={{ fontSize: "small" }}
                className="text-muted text-right"
              >{`#${id}`}</Col>
            </Row>
          </CardSubtitle>
          <hr />
          <ListGroup>
            <Field title="Destination" content={redis} />
            <Field title="Mode" content={modeName(mode)} />
            <Field
              title="Last update"
              content={`${timeSince(Date.parse(updated_at))} ago`}
            />
            {detail ? (
              <>
                <Field title="Scanner type" content={typeName(type)} />
                <Field
                  title="Created at"
                  content={new Date(created_at).toLocaleString()}
                />
                {typeSettings(type, settings)}
              </>
            ) : null}
          </ListGroup>
          <hr />
          <TransactionModal
            fetch={() => fetchDetail(id)}
            transactions={transactions}
          />
        </CardBody>
      </Card>
    </Col>
  );
};
