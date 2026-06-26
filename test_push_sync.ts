import axios from "axios";

async function run() {
  try {
    console.log("Sending push request to localhost:3000...");
    const res = await axios.post("http://localhost:3000/api/reaper-sync/push", {
      email: "test@example.com",
      pin: "1234",
      payload: "TRACK|Test Track\nFX|JS: Test FX\n"
    });
    console.log("Response:", res.status, res.data);
  } catch (err: any) {
    if (err.response) {
      console.error("Error Response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

run();
