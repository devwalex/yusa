const Nexmo = require("nexmo");
const Env = use("Env");

const sendSms = function(sender, receiver, message) {
  const nexmo = new Nexmo({
    apiKey: Env.get("NEXMO_API_KEY"),
    apiSecret: Env.get("NEXMO_API_SECRET")
  });

  nexmo.message.sendSms(sender, receiver, message, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      if (res.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${res.messages[0]["error-text"]}`
        );
      }
    }
  });
};

module.exports = sendSms;
