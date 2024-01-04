import { JsonRpcProvider, Wallet, ethers, parseEther } from 'ethers';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { walletAddress } = req.body;
            const provider = new JsonRpcProvider("https://node.ghostnet.etherlink.com");
            const signer = new Wallet(process.env.PRIVATE_KEY, provider);

            // const tx = await signer.sendTransaction({
            //     to: "0x2668cB1433C927a01b903AafdBe792C402CBc3E0",
            //     value: parseEther("0.1"),
            //   });
            
            const transaction = {
                to: walletAddress,
                value: parseEther("0.1"),
            };

            const txResponse = await signer.sendTransaction(transaction);
            // const receipt = await txResponse.wait();
            res.status(200).send(walletAddress);
        } else {
            res.setHeader('Allow', 'POST');
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }

}