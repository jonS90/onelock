OneLock
==============

This is a chrome extension which brings an interesting model of security to
normal web applications.

### Why does this exist?

Today's web applications run on trust. To use them, you must trust them to
respect your privacy and actively protect it against malicious hackers. The
problem is, violations of trust happen from time to time despite many best
efforts.

When a web service transmits a message from you to a friend, there are many
potential holes along the way where it can be leaked or stolen. You trust
*each* web-service to secure *each* hole. What if, instead, you trusted *one*
tool of yours to secure the whole thing? OneLock is that tool (well, it's a
prototype). "*Isn't that just https?*" I'm glad you asked, because, no, it's
not! Https eliminates the need to trust your connection (by using
client-to-server encryption). However, https doesn't help you avoid trusting
the server. **Onelock eliminates the need to trust the server** (by using
client-to-client encryption). Your intended recipient becomes the only entity
capable of decrypting your message.

Onelock uses public-key cryptography, which has been around for a while and has
been widely used. To my knowledge, it's never been generically molded onto web
applications in this way.

OneLock is experimental. Please don't count on it. I'm actually thinking of
re-writing it from scratch.
