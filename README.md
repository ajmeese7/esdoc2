[![Build Status](https://circleci.com/gh/esdoc2/esdoc2.png?style=shield&circle-token=:circle-token)](https://circleci.com/gh/esdoc2/esdoc2)
[![Coverage Status](https://codecov.io/gh/esdoc2/esdoc2/branch/master/graph/badge.svg)](https://codecov.io/gh/esdoc2/esdoc2)
![Document Coverage Status](http://esdoc2.org/badge.svg?t=0)

## ESDoc2

ESDoc2 is a drop-in replacement of ESDoc, a documentation generator for JavaScript. ESDoc2 was created as the result of the original author of ESDoc refusing to add any other contributors to the project.  ESDoc2 is the decentralized version, contributors and maintainers are welcome.

## Features
- Generates good documentation.
- Measures documentation coverage.
- Integrate test codes into documentation.
- Integrate manual into documentation.
- Parse ECMAScript proposals.
- Lots of [plugins](https://github.com/search?o=desc&q=esdoc2+filename%3Apackage.json)

## Quick Start
```sh
# Move to your project directory.
cd your-project/

# Install esdoc2 and standard plugin.
npm install esdoc2 esdoc2-standard-plugin

# Create a configuration file.
echo '{
  "source": "./src",
  "destination": "./docs",
  "plugins": [{"name": "esdoc2-standard-plugin"}]
}' > .esdoc.json

# Run esdoc2.
./node_modules/.bin/esdoc2

# View documentation
open ./docs/index.html
```

## Documentation
Please visit [esdoc2.org](http://esdoc2.org) to see more documentation.

## Development
1. `npm run build`
2. `./out/src/ESDocCLI.js`

## Acknolwedgements

- Ryo Maruyama, author of ESDoc
