import React from "react";
import Form from 'react-bootstrap/lib/Form';
import Button from 'react-bootstrap/lib/Button';

const MessageForm = ({
  addMessage,
  handleChange,
  currentText
}) => {
  return (
    <Form onSubmit={addMessage}>
      <Form.Group>
        <Form.Label>Send message to Discord</Form.Label>
        <Form.Control type="text" placeholder="Hello World" onChange={handleChange} value={currentText} />
      </Form.Group>

       <Button variant="primary" type="submit">
        Send Message
      </Button>
    </Form>
  );
};

export default MessageForm;
