exports.handler = async (event) => {
  console.log('Recebido event.body:', event.body); // Isto vai aparecer nos logs do Netlify

  return {
    statusCode: 200,
    body: JSON.stringify({ id: 'test_session_id' }),
  };
};
