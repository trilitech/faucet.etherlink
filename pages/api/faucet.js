import { JsonRpcProvider, Wallet, ethers, parseEther, getAddress, hexlify, parseUnits } from 'ethers';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { walletAddress } = req.body;
            const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
            const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

            const address = ethers.getAddress(walletAddress);

            let feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice;
            const transaction = {
                to: address,
                value: parseEther("0.1"),
                gasPrice: gasPrice
            };

            const txResponse = await wallet.sendTransaction(transaction);
            const receipt = await txResponse.wait();
            res.status(200).json({ receipt });
        } else {
            res.setHeader('Allow', 'POST');
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }

}