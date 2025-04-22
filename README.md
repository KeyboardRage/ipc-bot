# IPC-Bot

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