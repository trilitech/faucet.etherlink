import { NextResponse } from 'next/server';
import { JsonRpcProvider, ethers, parseEther, Network, Wallet } from 'ethers';

export default async function callFaucet(req, res) {
    try {
        // const { walletAddress } = await request.json()
        const { walletAddress } = await request.body();
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
        // return NextResponse.json(
        //     {
        //         body: { walletAddress, feeData },
        //     },
        //     {
        //         status: 200,
        //     },
        // );
        res.status(200).json({ walletAddress, feeData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        // return NextResponse.json(
        //     {
        //         body: "error",
        //     },
        //     {
        //         status: 500,
        //     },
        // );
    }
};