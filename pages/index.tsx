import { Center, Box, Heading, Flex, Spacer } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { AppBar } from '../components/AppBar'
import { CreateTokenAccount } from '../components/CreateTokenAccount'
import { GetTokenBalance } from '../components/getTokenBalance'
import { Minter } from '../components/minter'
import { MintTokens } from '../components/mintTokens'
import { TransferTokens } from '../components/TransferTokens'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <AppBar />
      <Head>
        <title>Token Minter</title>
      </Head>

      <Box w={'full'}>
        <Minter />
        <Flex width={'80%'} mx='auto' mt='10' wrap={'wrap'} justifyContent={{ base: "center", md: 'space-between' }}>
          <Box w={{ base: 'full', 'md': 'lg' }} color={'white'} mx={{ base: '0', md: '10' }} mb={10} bgColor={'slateblue'} p={5} borderRadius={'lg'}>
            <CreateTokenAccount />
          </Box>
          <Spacer />
          <Box w={{ base: 'full', 'md': 'lg' }} color={'white'} mx={{ base: '0', md: '10' }} mb={10} bgColor={'slateblue'} p={5} borderRadius={'lg'}>
            <MintTokens />
          </Box>

          <Box w={{ base: 'full', 'md': 'lg' }} color={'white'} mx={{ base: '0', md: '10' }} mb={10} bgColor={'slateblue'} p={5} borderRadius={'lg'}>
            <TransferTokens />
          </Box>

          <Box w={{ base: 'full', 'md': 'lg' }} color={'white'} mx={{ base: '0', md: '10' }} mb={10} bgColor={'slateblue'} p={5} borderRadius={'lg'}>
            <GetTokenBalance />
          </Box>
        </Flex>
      </Box>
    </div>
  )
}

export default Home