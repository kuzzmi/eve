TOKEN="OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA"
curl -XPOST 'https://api.wit.ai/speech?v=20141022' \
   -i -L \
   -H "Authorization: Bearer $TOKEN" \
   -H "Content-Type: audio/wav" \
   --data-binary "hey_yeva.wav"