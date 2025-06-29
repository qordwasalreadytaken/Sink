export default eventHandler(async (event) => {
  if (getMethod(event) === 'OPTIONS') {
    setHeader(event, 'Access-Control-Allow-Origin', 'https://qordwasalreadytaken.github.io');
    setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');
    return '';
  }

  setHeader(event, 'Access-Control-Allow-Origin', 'https://qordwasalreadytaken.github.io');

  const body = await readBody(event);

  const response = await fetch('https://sink.actuallyiamqord.workers.dev/api/link/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${useRuntimeConfig().siteToken}`, // or hardcoded if needed
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data;
});
