import { NextResponse } from 'next/server';
import { JsonRpcProvider, ethers, parseEther, Network, Wallet } from 'ethers';

export default async function POST(request) {
    try {
        // const { walletAddress } = await request.json()
        const { walletAddress } = await request.json();
        const provider = new JsonRpcProvider("https://node.ghostnet.etherlink.com");
        // const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
        
        const feeData = await provider.getFeeData();
        // const transaction = {
        //     to: walletAddress,
        //     value: parseEther("0.1"),
        //     gasPrice: feeData.gasPrice() 
        // };

        // const txResponse = await wallet.sendTransaction(transaction);
        // const receipt = await txResponse.wait();
        return NextResponse.json(
            {
                body: { walletAddress, feeData },
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