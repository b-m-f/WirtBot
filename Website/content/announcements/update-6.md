# WirtBot v3

Hello,

long time no update.
Over the past couple of months more people started to use WirtBot and gave Feedback.

This has lead to bugs being squashed and a more stable system overall, including new tests for the fixes.

But that alone would not be justifying an update post.

So here is the real update:

**AdBlocking has been removed** from WirtBot.

The dependencies that made this possible were not mature enough and would need a lot of work to fit the WirtBot use-case.
Deciding between helping the dependencies get their code fixed and removing AdBlocking from WirtBot was not easy.

But in the end WirtBot is supposed to connect devices into a private network. While this private network needs a DNS (which is still included with request forwarding, DNSoverTLS etc.) the job of blocking specific name resolutions is much better suited to be handled by a project such as [pi-hole](https://pi-hole.net/).

Simply forwarding DNS requests from the WirtBot network to your own **pi-hole** instance achieves the desired AdBlocking, WirtBot can retain its focus and a user can leverage the maturity of the **pi-hole** project.

The change is rolled out in version **3.0.0**.

I hope that all of you already using the WirtBot will be fine with this change. So long, happy coding.
