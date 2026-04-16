# Changelog

## 0.2.0

### Minor Changes

- e826bd3: Added onAction prop to VideoCommentProvider, called after every local user action with the action type and full payload including generated ids. Enables syncing with external stores such as REST APIs without diffing onCommentsChange.

### Patch Changes

- 80f4c6e: Fix duplicate keys

## 0.1.2

### Patch Changes

- ed7897f: Fix comment and reply ids and user ids not matching external sources. Added setComments for bulk replacement of comments

## 0.1.1

### Patch Changes

- 8fabe93: Updated changeset to public access

## 0.1.0

### Minor Changes

- 8b42322: Initial release. Timestamped video comments with optional prebuilt components.

### Patch Changes

- ac8a9d4: Update readme to include react and react-dom in install command
- eb7fb36: Updated readme
