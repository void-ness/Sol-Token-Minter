import { Center, Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { AppBar } from '../components/AppBar'
import { CreateTokenAccount } from '../components/CreateTokenAccount'
import { Minter } from '../components/minter'
import { MintTokens } from '../components/mintTokens'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <AppBar />
      <Head>
        <title>Token Minter</title>
      </Head>

      <Center>
        <Box>
          <Heading as="h1" size="lg" color="white" ml={4} mt={8} mb={4}>
            <Minter />
          </Heading>

          <Heading as="h1" size="lg" color="white" ml={4} mt={8} mb={4}>
            <CreateTokenAccount />
          </Heading>

          <Heading as="h1" size="lg" color="white" ml={4} mt={8} mb={4}>
            <MintTokens />
          </Heading>

        </Box>
      </Center>
    </div>
  )
}

export default Home