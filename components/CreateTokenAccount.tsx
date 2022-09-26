import { FC, useState, useEffect } from "react";
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

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
        <div>
            <form onSubmit={CreateTokenAcc}>
                <FormControl>
                    <FormLabel htmlFor="mint">
                        Token Mint:
                    </FormLabel>
                    <Input
                        id="mint"
                    />
                </FormControl>

                <FormControl mt={5}>
                    <FormLabel htmlFor="owner">
                        Token Account Owner:
                    </FormLabel>
                    <Input
                        id="owner"
                        name="owner"
                    />
                </FormControl>

                <Button
                    type="submit"
                    color={'gray.700'}
                    mt={5}
                >
                    submit
                </Button>
            </form>

            {txSig ? (
                <div>
                    <p>Token Account Address: {tokenAccount}</p>
                    <p>view the newly created token account transaction from</p>
                    <a href={link()}>here</a>
                </div>
            ) : null}
        </div>
    )
}