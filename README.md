# Align text extension for Visual Studio Code

This VS Code extension allows you to align lines based on a user-provided regular expression. Essentially we pad with white space either on the left or right of a regular expression, depending whether you want to align columns or on a word.


## Align columns

Command palette > Align Text: Align columns

<gif>

When run:
- Default value to identify the end of a column is `['"],` which means either a single or double quote followed by a comma.
- Lines are split on the right of this pattern, which are then padded with ' ' to be the same length.
- If there are multiple matches on a line, we pad each to the max length of its respective column.

## Align on word

Command palette > Align Text: Align on word

<gif>

When run:
- Default value to align on is `=`. To find matches, whatever the user enters is sandwiched with a whitespace character, i.e. `\s=\s`.
- Lines are split on the left of this pattern, which are then padded with ' ' to be the same length.
- If there are multiple matches on a line, we pad each match appropriately.

## Misalign

Command palette > Align Text: Misalign selection

<gif>

When run:
- Replace all excessive whitespace with a single space, ignoring indentation.
