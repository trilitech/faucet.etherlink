import { NextResponse } from 'next/server';
import { JsonRpcProvider, ethers, parseEther, Network } from 'ethers';

export default async function POST(request) {
    try {
        // const { walletAddress } = await request.json()
        const { walletAddress } = request.body;
        const privateKey = process.env.PRIVATE_KEY;
        const etherlink = new Network("etherlink testnet", 128123);
        // const provider = new JsonRpcProvider(process.env.JSON_RPC_URL);
        const provider = new JsonRpcProvider(process.env.JSON_RPC_URL, Network.from(etherlink), { staticNetwork: true })
        // const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);
        const wallet = new ethers.Wallet(privateKey, provider);

        
        const feeData = await provider.getFeeData();
        const transaction = {
            to: walletAddress,
            value: parseEther("0.1"),
            gasPrice: feeData.gasPrice() 
        };

        const txResponse = await wallet.sendTransaction(transaction);
        const receipt = await txResponse.wait();
        return NextResponse.json(
            {
                body: { receipt },
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                body: "error",
            },
            {
                status: 500,
            },
        );
    }
};