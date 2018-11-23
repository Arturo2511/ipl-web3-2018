import React from "react";
import {Container, ListGroup} from 'react-bootstrap';
import MessageForm from "./message_form";
import MessageItem from './message_item';


const MessagesComponent = ({
  messages,
  addMessage,
  handleChange,
  currentText,
  deleteMessage
}) => {
  return (
    <Container>
      <h3>Messages</h3>
      <ListGroup>
        {
          messages.map(( message, i )=> (
            <ListGroup.Item key={i} >
              <MessageItem message={message} deleteMessage={deleteMessage} />
            </ListGroup.Item>
          ))
        }
      </ListGroup>
      <MessageForm
            addMessage={addMessage}
            handleChange={handleChange}
            currentText={currentText}
          />
    </Container>
  );
};

export default MessagesComponent;
