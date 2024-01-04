import { JsonRpcProvider, Wallet, ethers, parseEther } from 'ethers';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { walletAddress } = req.body;
            const provider = new JsonRpcProvider("https://node.ghostnet.etherlink.com");
            const signer = new Wallet(process.env.PRIVATE_KEY, provider);

            const tx = await signer.sendTransaction({
                to: "0x2668cB1433C927a01b903AafdBe792C402CBc3E0",
                value: ethers.parseUnits('0.001', 'ether'),
              });
            
            // const transaction = {
            //     to: walletAddress,
            //     value: parseEther("0.1"),
            // };

            // const txResponse = await wallet.sendTransaction(transaction);
            // const receipt = await txResponse.wait();
            res.status(200).send(walletAddress);
        } else {
            res.setHeader('Allow', 'POST');
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}