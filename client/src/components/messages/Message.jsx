import PropTypes from "prop-types";

const Message = (message) => {
  return <div>{message.msg}</div>;
};

Message.propTypes = {
  message: PropTypes.object,
};
export default Message;
