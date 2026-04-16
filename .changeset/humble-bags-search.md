---
'react-video-comments': minor
---

Added onAction prop to VideoCommentProvider, called after every local user action with the action type and full payload including generated ids. Enables syncing with external stores such as REST APIs without diffing onCommentsChange.
