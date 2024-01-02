import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export default async function POST(request) {
    try {
        // const { walletAddress } = await request.json()
        const { walletAddress } = JSON.parse(request.body);
        const privateKey = process.env.PRIVATE_KEY;
        const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);
        const wallet = new ethers.Wallet(privateKey, provider);
        const transaction = {
            to: walletAddress,
            value: ethers.utils.parseEther("0.1"),
            gasPrice: await wallet.provider.getGasPrice(),
        };

        const txResponse = await wallet.sendTransaction(transaction);
        const receipt = await txResponse.wait();
        return new NextResponse(JSON.stringify({ receipt }), { status: 200 });
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
        // return NextResponse.json(
        //     {
        //         body: "error",
        //     },
        //     {
        //         status: 500,
        //     },
        // );
        return new NextResponse(JSON.stringify({ error: "An error occurred" }), { status: 500 });
    }
};