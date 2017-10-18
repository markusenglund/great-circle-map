// Split up routes with slashes into separate routes
export default function parseStringWithSlashes(string) {
  // ex str = ["LHR/DUB-JFK"]
  const wordWithSlashesRegex = /[\w/]*\/[\w/]*/;
  const routeArray = string
    .match(wordWithSlashesRegex)[0] // ex ["LHR/DUB"]
    .split(/\//g)
    .map(part => string.replace(wordWithSlashesRegex, part));
  return routeArray;
}
