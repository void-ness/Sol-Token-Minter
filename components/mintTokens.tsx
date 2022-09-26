import { FC, useState, useEffect } from "react";
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

export const MintTokens: FC = () => {
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
        })

        const account = await token.getAccount(connection, associatedTokenAddress);
        setBalance(account.amount.toString());
    }

    return (
        <div>
            <form onSubmit={mintTokenTx}>
                <FormControl>
                    <FormLabel htmlFor="mint">
                        Token Mint:
                    </FormLabel>
                    <Input
                        id="mint"
                    />
                </FormControl>

                <FormControl mt={5}>
                    <FormLabel htmlFor="receipent">
                        Receipent
                    </FormLabel>
                    <Input
                        id="receipent"
                    />
                </FormControl>

                <FormControl mt={5}>
                    <FormLabel htmlFor="amount">
                        Tokens to Mint
                    </FormLabel>
                    <Input
                        id="amount"
                    />
                </FormControl>

                <Button
                    type="submit"
                    color={'gray.700'}
                    mt={5}
                >
                    Mint Tokens
                </Button>
            </form>

            {txSig ? (
                <div>
                    <p>Token Balance: {balance} </p>
                    <p>view the newly created token account transaction from</p>
                    <a href={link()}>here</a>
                </div>
            ) : null}
        </div>
    )
}