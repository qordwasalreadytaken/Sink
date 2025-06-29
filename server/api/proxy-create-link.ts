export default eventHandler(async (event) => {
  const body = await readBody(event);

  const response = await fetch('https://sink.actuallyiamqord.workers.dev/api/link/create', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer TacoToken', // ← your hardcoded token
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data;
});
