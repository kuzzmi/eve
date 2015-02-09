curl \
-sS \
  -H 'Authorization: Bearer OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA' \
  'https://api.wit.ai/message?v=20150209&q='"$1"' ' | node decider.js