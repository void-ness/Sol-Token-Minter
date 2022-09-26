import { FC, useState } from "react";
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Text } from "@chakra-ui/react";

export const GetTokenBalance: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState("");

    const transferTokenTx = async (event: any) => {
        event.preventDefault();

        if (!connection) {
            return;
        }

        const mint = new web3.PublicKey(event.target.mint.value);
        const receipent = new web3.PublicKey(event.target.receipent.value);

        const associatedTokenAddress = await token.getAssociatedTokenAddress(
            mint,
            receipent,
            false,
            token.TOKEN_PROGRAM_ID,
            token.ASSOCIATED_TOKEN_PROGRAM_ID
        )

        token.getAccount(connection, associatedTokenAddress).then((account) => {
            setBalance(account.amount.toString());
        });
    }

    return (
        <Box>
            <Heading size={'lg'} mb={4}>
                Get Token Balance
            </Heading>
            <form onSubmit={transferTokenTx}>
                <FormControl>
                    <FormLabel htmlFor="mint">
                        Token Mint:
                    </FormLabel>
                    <Input
                        focusBorderColor="white"
                        id="mint"
                        placeholder="Enter the mint address"
                        _placeholder={{ color: 'white', opacity: '0.9' }}
                        color='gray.200'
                    />
                </FormControl>

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

                <Button
                    isDisabled={publicKey ? false : true}
                    type="submit"
                    color={'gray.700'}
                    mt={5}
                >
                    Get Balance
                </Button>
            </form>

            {connection ? (
                <Box textAlign={'left'} fontSize="xl" mt={5} color='gray.200'>
                    <Text>Token Balance: <b>{balance}</b></Text>
                </Box>
            ) : null}
        </Box>
    )
}