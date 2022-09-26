import { FC, useState, useEffect } from "react";
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Link, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";

export const TransferTokens: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [tokenAccount, setTokenAccount] = useState("");
    const [balance, setBalance] = useState("");
    const [txSig, setTxSig] = useState('');

    const link = () => { return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : "" }

    const mintTokenTx = async (event: any) => {
        event.preventDefault();

        if (!connection || !publicKey) {
            return;
        }

        const mint = new web3.PublicKey(event.target.mint.value);
        const receipent = new web3.PublicKey(event.target.receipent.value);
        const amount = event.target.amount.value;
        console.log(amount);

        const associatedTokenAddress = await token.getAssociatedTokenAddress(
            mint,
            receipent,
            false,
            token.TOKEN_PROGRAM_ID,
            token.ASSOCIATED_TOKEN_PROGRAM_ID
        )

        const transaction = new web3.Transaction().add(
            token.createMintToInstruction(
                mint,
                associatedTokenAddress,
                publicKey,
                amount
            )
        )

        sendTransaction(
            transaction,
            connection
        ).then((sig) => {
            setTxSig(sig)
            setTokenAccount(associatedTokenAddress.toString());

            token.getAccount(connection, associatedTokenAddress).then((account) => {
                setBalance(account.amount.toString());
            });
        })


    }

    return (
        <Box>
            <Heading size={'lg'} mb={4}>
                Transfer your Tokens
            </Heading>
            <form onSubmit={mintTokenTx}>
                <FormControl mt={5}>
                    <FormLabel htmlFor="receipent">
                        Receipent
                    </FormLabel>
                    <Input
                        focusBorderColor="white"
                        id="receipent"
                        placeholder="Enter the account owner public key"
                        _placeholder={{ color: 'white', opacity: '0.9' }}
                        color='gray.200'
                    />
                </FormControl>

                <FormControl mt={5}>
                    <FormLabel htmlFor="receipent">
                        Amount of Tokens to Transfer
                    </FormLabel>
                    <NumberInput defaultValue={1} step={1} id='amount' w={'3xs'}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <Button
                    isDisabled={publicKey ? false : true}
                    type="submit"
                    color={'gray.700'}
                    mt={5}
                >
                    Transfer Tokens
                </Button>
            </form>

            {txSig ? (
                <Box textAlign={'left'} fontSize="md" mt={5} color='gray.300'>
                    <Text>Token Balance: <br /> <b>{balance}</b></Text>
                    <Text mt={3}>View the transaction on <Link href={link()} color='gray.50'>Solana Explorer</Link></Text>
                </Box>
            ) : null}
        </Box>
    )
}