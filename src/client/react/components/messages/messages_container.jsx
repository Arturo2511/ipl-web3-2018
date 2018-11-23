import React from "react";
import MessagesComponent from "./messages_component";
import sendApiRequest from "react/utils/api";

class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], body: "" };
    this.handleChange = this.handleChange.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  handleChange(e) {
    this.setState({ body: e.target.value });
  }

  fetchMessages(){
    sendApiRequest({ url: "/api/messages" })
      .then((messages) => {
        this.setState({
          messages: messages,
        })
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          messages: [],
        })
      })
  }

  addMessage(){
    const url = `/api/messages/`
    sendApiRequest({
        url,
        method: "POST",
        params: {body: this.state.body}
      })
      .then((messages) => {
        this.setState(state => ({
          messages: state.messages.concat(messages),
          body: ""
        }));
      })
  }

  deleteMessage(message){
    const url = `/api/messages/${message._id}`
    sendApiRequest({
        url,
        method: "DELETE",
      })
      .then((_ignored) => {
        const {messages} = this.state;

        const messageIndex = messages.indexOf(message);
        if (messageIndex > -1) {
          messages.splice(messageIndex, 1);
        }
        this.setState({
          messages: messages,
        })
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          messages: [],
        })
      })
  }

  componentDidMount(){
    this.fetchMessages()
  }

  
  render() {
    return (
      <MessagesComponent
        currentText={this.state.body}
        messages={this.state.messages}
        addMessage={this.addMessage}
        handleChange={this.handleChange}
        deleteMessage={this.deleteMessage}
      />
    );
  }
}

export default MessagesContainer;
