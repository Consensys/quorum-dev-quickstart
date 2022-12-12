# Quorum Dev Quickstart


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Usage](#usage)

## Prerequisites

To run these tutorials, you must have the following installed:

- [Docker and Docker-compose](https://docs.docker.com/compose/install/) v2 or higher

| ⚠️ **Note**: If on MacOS or Windows, please ensure that you allow docker to use upto 4G of memory or 6G if running Privacy examples under the _Resources_ section. The [Docker for Mac](https://docs.docker.com/docker-for-mac/) and [Docker Desktop](https://docs.docker.com/docker-for-windows/) sites have details on how to do this at the "Resources" heading       |
| ---                                                                                                                                                                                                                                                                                                                                                                                |


| ⚠️ **Note**: This has only been tested on Windows 10 Build 19045, WSL2 and Docker Desktop                                                                                                                                                 |
| ---                                                                                                                                                                                                                                                                                                                                                                                |

- On Windows, please use WSL2 kernels 5.15x or higher
- You can use either Docker Desktop or docker-engine (with the compose plugin) within the WSL2 environment
- [Nodejs](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/cli/node)


## Usage 

Create the docker compose file and artifacts with 

```
$> npx quorum-dev-quickstart
              ___
             / _ \   _   _    ___    _ __   _   _   _ __ ___
            | | | | | | | |  / _ \  | '__| | | | | | '_ ' _ \
            | |_| | | |_| | | (_) | | |    | |_| | | | | | | |
             \__\_\  \__,_|  \___/  |_|     \__,_| |_| |_| |_|
     
        ____                          _
       |  _ \    ___  __   __   ___  | |   ___    _ __     ___   _ __
       | | | |  / _ \ \ \ / /  / _ \ | |  / _ \  | '_ \   / _ \ | '__|
       | |_| | |  __/  \ V /  |  __/ | | | (_) | | |_) | |  __/ | |
       |____/   \___|   \_/    \___| |_|  \___/  | .__/   \___| |_|
                                                 |_|
       ___            _          _            _                    _
      / _ \   _   _  (_)   ___  | | __  ___  | |_    __ _   _ __  | |_
     | | | | | | | | | |  / __| | |/ / / __| | __|  / _' | | '__| | __|
     | |_| | | |_| | | | | (__  |   <  \__ \ | |_  | (_| | | |    | |_ 
      \__\_\  \__,_| |_|  \___| |_|\_\ |___/  \__|  \__,_| |_|     \__|


Welcome to the Quorum Developer Quickstart utility. This tool can be used
to rapidly generate local Quorum blockchain networks for development purposes
using tools like GoQuorum, Besu, and Codefi Orchestrate.

To get started, be sure that you have both Docker and Docker Compose
installed, then answer the following questions.

Which Ethereum client would you like to run? Default: [1]
	1. Hyperledger Besu
	2. GoQuorum
  ...
  Do you want to try out Codefi Orchestrate? [Y/n]
  ...
  Do you want to try out Quorum Key Manager? [Y/n]
  ...
  Do you wish to enable support for private transactions? [Y/n]
  ...
  Do you wish to enable support for logging with Splunk or ELK (Elasticsearch, Logstash & Kibana)? Default: [1]
	1. None
	2. Splunk
	3. ELK
...
Where should we create the config files for this network? Please
choose either an empty directory, or a path to a new directory that does
not yet exist. Default: ./quorum-test-network
```

This prompts you to pick a quorum variant, whether you would like to try Privacy and the location for the artifacts. By 
default artifact files are stored at `./quorum-test-network`, change directory to the artifacts folder: 

```
$> cd quorum-test-network
``` 


Alternatively, you can use cli options and skip the prompt above like so:

```
npx quorum-dev-quickstart --clientType besu --outputPath ./quorum-test-network --monitoring default --privacy true --orchestrate false --quorumKeyManager false
```

The arguments ```--privacy``` and ```--clientType``` are required, the others contain defaults if left blank.

**To start services and the network:**

Follow the README.md file of select artifact:
1. [Hyperledger Besu](./files/besu/README.md)
2. [GoQuorum](./files/goquorum/README.md)
3. [Codefi Orchestrate](./files/orchestrate/README.md)
3. [Quorum Key Manager](./files/quorum-key-manager/README.md)

## Troubleshooting

### Besu only - `java.io.IOException: Permission denied` for volumes

The `besu` containers use user `besu` mapped to user:group 1000. On your local machine, if your userid is not 1000, you will see this error. To fix this either run as user 1000 or map
the container's user 1000 to your local user id so permissions will work like so in the compose file

```
image: some:img
user: $(id -u):$(id -g)
```
