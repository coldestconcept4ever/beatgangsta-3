async function run() {
  const payload = {
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: "hi" }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "STRING"
      }
    }
  };
  const res = await fetch('http://127.0.0.1:3000/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log(res.status, await res.text());
}
run();
