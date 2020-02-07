# semantic-release-version-bump

A [`semantic-release`](https://semantic-release.gitbook.io) plugin to bump a version number in files where version is stored as a comment, e.g. in a WordPress PHP plugin file:

```php
<?php
/**
 * Name:      A plugin
 * Version:   1.2.0
 */
```

## Configuration

| option | required | type | function |
| :------------- | :------------- | :------------- |  :------------- |
| `files` | ✓ | `string \| [string]` | glob (or array of globs) to match the files in which version should be bumped |
| `callback` | 𐄂 | `string` | command to be called after the version is bumped in file/s |

## Example

```json
"release": {
  "prepare": [
    [
      "semantic-release-version-bump",
      {
        "files": "my-plugin.php",
        "callback": "zip -r my-plugin.zip ."
      }
    ]
  ]
}
```

## Limitations

It currently handles only a `Version:` string, used in WordPress plugin and theme files.
