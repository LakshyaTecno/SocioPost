const notificationConfig = require("../configs/notification.config");

const axios = require("axios");

module.exports = (subject, content, recepients, requester) => {
  console.log(subject);
  const reqBody = {
    subject: subject,
    recepientEmails: recepients,
    content: content,
    requester: requester,
  };

  try {
    axios
      .post(notificationConfig.serviceURL, reqBody)
      .then((response) => {
        console.log("Request sent");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err.message);
  }
};
