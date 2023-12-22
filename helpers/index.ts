const shortenAddress = (addressHash: string) => {
    const first5Chars = addressHash.slice(0, 6)
    const last5Chars = addressHash.slice(-4)

    const finalStr = first5Chars + "..." + last5Chars
    return finalStr
}

const calculateReadableBal = (bigIntNum: string | number) => {
    return Number(bigIntNum) / 10 ** 18
}



export { shortenAddress, calculateReadableBal }