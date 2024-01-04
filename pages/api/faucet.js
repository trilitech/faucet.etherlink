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

            // const feeData = await wallet.provider.getFeeData();
            // const gasPrice = await wallet.provider.getGasPrice();

            // const tx = await signer.sendTransaction({
            //     to: "0x2668cB1433C927a01b903AafdBe792C402CBc3E0",
            //     value: parseEther("0.1"),
            //   });
            const transaction = {
                to: address,
                value: parseEther("0.1"),
                // gasLimit: hexlify(21000), // Typical gas limit for ETH transfer
                gasPrice: parseUnits('100', 'gwei'),
            };

            // const txResponse = await wallet.sendTransaction(transaction);
            // const receipt = await txResponse.wait();
            res.status(200).send(gasPrice);
        } else {
            res.setHeader('Allow', 'POST');
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }

}