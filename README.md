# IPC-Bot

1. Install dependencies
```bash
npm install
```

2. Run in dev
```bash
npm run dev
```

## Todo
- More commands are still needed, like
  - block recipient
  - block sender
  - unblock recipient
  - unblock sender
  - list blocked senders & recipients
- command cooldowns per user
- API rate limiting (cooldown per user)
- global API rate limiting on broadcast
- define the payload that can be sent to Discord
- optimize message dispatching to send messages in batches
  - especially that we could be using webhooks for this
- make commands auth-based
  - especially settings command can have a default permission level set to Manage Server or something 

# Testing with WebSocket
First, run the server itself
```bash
npm run dev
```

Then, start a server that will serve the testing page
```bash
npm run dev:test-socket
```

Then, you should be able to go to [http://127.0.0.1:3001](http://127.0.0.1:3001).
1. Create a JWT for yourself
2. Paste the JWT into the input field on the right, then click connect
3. You can see logs on the left. You can create your own JSON payload to send on the right.