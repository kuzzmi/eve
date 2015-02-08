# export AUDIODRIVER=alsa
# export AUDIODEV=hw:0,0
rec -V1 -q -t wav - rate 16k silence 1 0.1 3% 1 0.5 3% | curl -XPOST 'https://api.wit.ai/speech?v=20150207' \
  -H "Authorization: Bearer OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA" \
  -H "Content-Type: audio/wav" \
  --data-binary @- -sS | node decider.js
# && bash $0
# export AUDIODEV=hw:1,0
