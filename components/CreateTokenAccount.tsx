import { FC, useState, useEffect } from "react";
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Text } from "@chakra-ui/react";

export const CreateTokenAccount: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [txSig, setTxSig] = useState('');
    const [tokenAccount, setTokenAccount] = useState("");

    const link = () => { return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : "" }

    const CreateTokenAcc = async (event: any) => {
        event.preventDefault();

        if (!connection || !publicKey) {
            return;
        }

        const mint = new web3.PublicKey(event.target.mint.value);
        const owner = new web3.PublicKey(event.target.owner.value);

        const associatedTokenAddress = await token.getAssociatedTokenAddress(
            mint,
            publicKey,
            false,
            token.TOKEN_PROGRAM_ID,
            token.ASSOCIATED_TOKEN_PROGRAM_ID
        )

        const transaction = new web3.Transaction().add(
            token.createAssociatedTokenAccountInstruction(
                publicKey,
                associatedTokenAddress,
                owner,
                mint
            )
        )

        sendTransaction(
            transaction,
            connection
        ).then((sig) => {
            setTxSig(sig)
            setTokenAccount(associatedTokenAddress.toString())
        })
    }

    return (
        <Box>
            <Heading size={'lg'} mb={4}>
                Create Token Account
            </Heading>

            <form onSubmit={CreateTokenAcc}>
                <FormControl>
                    <FormLabel htmlFor="mint">
                        Token Mint:
                    </FormLabel>
                    <Input
                        id="mint"
                        focusBorderColor="white"
                        placeholder="Enter the mint address"
                        _placeholder={{ color: 'white', opacity: '0.9' }}
                        color='gray.200'
                    />
                </FormControl>

                <FormControl mt={5}>
                    <FormLabel htmlFor="owner">
                        Token Account Owner:
                    </FormLabel>
                    <Input
                        id="owner"
                        focusBorderColor="white"
                        placeholder="Enter the public key of account owner"
                        _placeholder={{ color: 'white', opacity: '0.9' }}
                        color='gray.200'
                    />
                </FormControl>

                <Button
                    isDisabled={publicKey ? false : true}
                    type="submit"
                    color={'gray.700'}
                    mt={5}
                >
                    Create Account
                </Button>
            </form>

            {txSig ? (
                <Box textAlign={'left'} fontSize="md" mt={5} color='gray.300'>
                    <Text>Token Account Address:<br /> <b>{tokenAccount}</b></Text>
                    <Text mt={3}>View the transaction on <Link href={link()} color='gray.50'>Solana Explorer</Link></Text>
                </Box>
            ) : null}
        </Box>
    )
}