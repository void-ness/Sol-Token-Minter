import { FC, useState, useEffect } from 'react'
import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

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
            <div>
                <p>{publicKey ? `SOL Balance: ${balance / web3.LAMPORTS_PER_SOL}` : ""}</p>
            </div>

            {publicKey ? (
                <form onSubmit={createMint}>
                    <button type="submit">
                        Create Mint
                    </button>
                </form>
            ) : (
                <span>Connect Your Wallet</span>
            )}

            {tx ? (
                <div>
                    <p>Minted account address: ${mint}</p>
                    <p>view the transaction on </p>
                    <a href={link()}>Solana Explorer</a>
                </div>
            ) : null}
        </>
    )
}