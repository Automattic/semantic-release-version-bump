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

It takes a single option (`files`), a glob to match the files - it can either be a string or an array of strings.

In package.json:

```json
"release": {
  "prepare": [
    [
      "semantic-release-version-bump",
      {
        "files": "plugin-file.php"
      }
    ]
  ]
}
```

## Limitations

It currently handles only a `Version:` string, used in WordPress plugin and theme files.
