const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const contractsPath = path.resolve('../','contracts');

const buildSources = () => {
  const sources = {};
  const contractsFiles = fs.readdirSync(contractsPath);
  contractsFiles.forEach(file => {
    const contractFullPath = path.resolve(contractsPath, file);
    sources[file] = {
      content: fs.readFileSync(contractFullPath, 'utf8')
    };
  });
  return sources;
}

const input = {
	language: 'Solidity',
	sources: buildSources(),
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
			}
		}
	}
}

const compileContracts = () => {
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
	const compiledContracts = output.contracts;
	for (let contract in compiledContracts) {
		for(let contractName in compiledContracts[contract]) {
			fs.outputJsonSync(
				path.resolve(contractsPath, `${contractName}.json`),
				compiledContracts[contract][contractName], { spaces: 2 }
			)
		}
	}
}

const main = () => {
	createBuildFolder();
	compileContracts();
}

if (require.main === module) {
  main();
}
module.exports = main


