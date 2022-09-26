import { FC, useState, useEffect } from 'react'
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Box, Button, Center, Flex, Link, Spacer, Text } from '@chakra-ui/react'

export const Minter: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [balance, setBalance] = useState(0);
    const [tx, setTx] = useState('');
    const [mint, setMint] = useState('');

    const link = () => {
        return tx
            ? `https://explorer.solana.com/tx/${tx}?cluster=devnet`
            : "";
    }

    useEffect(() => {
        if (!connection || !publicKey) {
            return
        }

        connection.getAccountInfo(publicKey).then((info) => {
            setBalance(info?.lamports ?? 0)
        })
    }, [connection, publicKey])

    const createMint = async (event: any) => {
        event.preventDefault();

        if (!connection || !publicKey) {
            return;
        }

        const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
        const accountKeypair = web3.Keypair.generate();
        const programId = token.TOKEN_PROGRAM_ID

        const transaction = new web3.Transaction()

        const createAccountInstruction = web3.SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: accountKeypair.publicKey,
            space: token.MINT_SIZE,
            lamports,
            programId
        })

        const initializeMintInstruction = token.createInitializeMintInstruction(
            accountKeypair.publicKey,
            2,
            publicKey,
            publicKey,
            programId
        )

        transaction.add(createAccountInstruction, initializeMintInstruction);

        sendTransaction(
            transaction,
            connection,
            {
                signers: [accountKeypair]
            }
        ).then((sig) => {
            setMint(accountKeypair.publicKey.toString());
            setTx(sig);
        })
    }

    return (
        <>
            <Box color='white' fontWeight={'semibold'} px={{ base: '2', md: '7' }} mt={5} textAlign={'center'} w={{ base: '90%', md: 'full' }} mx="auto">
                <Flex justifyContent={'center'} alignItems={'center'}>
                    {publicKey ? (
                        <form onSubmit={createMint}>
                            <Button
                                type='submit'
                                colorScheme={'purple'}
                                width={{ base: '30', md: '40' }}
                                height={{ base: '10', md: '12' }}
                                fontSize={'lg'}
                            >
                                Create Mint
                            </Button>
                        </form>
                    ) : (
                        <Text fontSize={{ base: 'lg', md: '3xl' }}>
                            Connect Your Wallet
                        </Text>
                    )}

                    <Spacer />

                    <div>
                        <Text fontSize={{ base: 'xl', md: '3xl' }}>
                            {publicKey ? `Balance: ${(balance / web3.LAMPORTS_PER_SOL).toPrecision(3)} SOLs` : ""}
                        </Text>
                    </div>
                </Flex>

                {tx ? (
                    <Box textAlign={'left'} fontSize={{ base: 'md', md: 'lg' }} mt={8} color='gray.300'>
                        <Text>Minted account address: <b>{mint}</b></Text>
                        <Text mt={3}>View the transaction on <Link href={link()} color='gray.50'>Solana Explorer</Link></Text>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}