import type { NextPage } from 'next'
import { Heading, Text, VStack, Box, Button, Input, Spacer, Flex } from '@chakra-ui/react'
import { useState, useEffect} from 'react'
import {ethers} from "ethers"
import ReadQuorumToken from "../components/ReadQuorumToken"
import TransferQuorumToken from "../components/TransferQuorumToken"

declare let window:any

export default function Home() {

  const [balance, setBalance] = useState<string | undefined>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [erc20ContractAddress, setErc20ContractAddress] = useState<string>("0x");
  const [chainId, setChainId] = useState<number | undefined>();

  useEffect( () => {
    if(!currentAccount || !ethers.isAddress(currentAccount)) return;
    if(!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.getBalance(currentAccount).then((result)=> {
      setBalance(ethers.formatEther(result));
    })
    provider.getNetwork().then((result)=>{
      setChainId(ethers.toNumber(result.chainId));
    })

  },[currentAccount])

  const onClickConnect = () => {
    if(!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    // MetaMask requires requesting permission to connect users accounts
    provider.send("eth_requestAccounts", [])
    .then((accounts)=>{
      if(accounts.length>0) setCurrentAccount(accounts[0])
    })
    .catch((e)=>console.log(e))
  }

  const onClickDisconnect = () => {
    setBalance(undefined)
    setCurrentAccount(undefined)
  }


  return (
    <>
      <Heading as="h3" my={4}>QuorumToken</Heading>          
      <VStack>
      <Box w='100%' my={4}>
        {currentAccount  
          ? <Button type="button" w='100%' onClick={onClickDisconnect}>
                Connected to Metamask with account: {currentAccount}
            </Button>
          : <Button type="button" w='100%' onClick={onClickConnect}>
                  Connect to MetaMask
              </Button>
        }
        </Box>
        {currentAccount  
          ?<Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Account</Heading>
          <Text my={4}>Details of the account connected to Metamask</Text>
          <Text><b>Balance of current account (ETH)</b>: {balance}</Text>
          <Text><b>ChainId</b>: {chainId} </Text>
          {/* todo: fix formatting here */}
          <Text><b>Address that the QuorumToken was deployed to</b>: </Text>
          <Input value={erc20ContractAddress}  name="erc20ContractAddress" onChange={e => setErc20ContractAddress(e.target.value)} />
        </Box>
        :<></>
        }

        {(erc20ContractAddress!="0x")  
          ?<Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize='xl'>Read QuorumToken</Heading>
          <Text my={4}>Query the smart contract info at address provided</Text>
          <Spacer />
          <ReadQuorumToken 
            addressContract={erc20ContractAddress}
            currentAccount={currentAccount}
          />
        </Box>
        :<></>
        }

        {(erc20ContractAddress!="0x")  
          ?<Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Transfer QuorumToken</Heading>
          <Text my={4}>Interact with the token</Text>
          <TransferQuorumToken
            addressContract={erc20ContractAddress}
            currentAccount={currentAccount}
          />
        </Box>
        :<></>
        } 

      </VStack>
    </>
  )
}
