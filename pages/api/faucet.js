import { JsonRpcProvider, Wallet, ethers, parseEther } from 'ethers';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { walletAddress } = req.body;
            const provider = new JsonRpcProvider("https://node.ghostnet.etherlink.com");
            const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
            
            const feeData = await provider.getFeeData();

            const maxFeePerGas = feeData.maxFeePerGas;
            // const transaction = {
            //     to: walletAddress,
            //     value: parseEther("0.1"),
            //     gasPrice: feeData.gasPrice
            // };

            // const txResponse = await wallet.sendTransaction(transaction);
            // const receipt = await txResponse.wait();
            res.status(200).send(maxFeePerGas);
        } else {
            res.setHeader('Allow', 'POST');
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}