const connectButton = document.getElementById("connect-button");
const walletInfo = document.getElementById("wallet-info");
const network = document.getElementById("network");
const address = document.getElementById("address");
const balance = document.getElementById("balance");
const nftButton = document.getElementById("nft-button");
const airdropButton = document.getElementById("airdrop-button");
const tokenaddButton = document.getElementById("tokenadd-button");

const abi = [
    {
        inputs: [
        {
            internalType: "string",
            name: "tokenURI",
            type: "string",
        },
        {
            internalType: "address",
            name: "_to",
            type: "address",
        },
        ],
        name: "mintNFT",
        outputs: [
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "airdrop",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const updateWalletInfo = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
}

    const accounts = await window.web3.eth.getAccounts();
    const networkId = await window.web3.eth.net.getId();
    const networkName = getNetworkName(networkId);
    const balanceWei = await window.web3.eth.getBalance(accounts[0]);
    const balanceEth = window.web3.utils.fromWei(balanceWei, "ether");

    network.innerText = networkName;
    address.innerText = accounts[0];
    balance.innerText = `${balanceEth} KLAY`;
};


const executeNFTMINT = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
        abi,
        "0xd1C7eD082Dcb3C0F3b83E07061DF73571F436926"
    );
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
        .mintNFT(
            "https://ipfs.io/ipfs/QmNc7o6ABBMd5VbW6h49TPYFKzQ422MwVTkqaQefY6CDv7",
            accounts[0]
        )
        .send({ from: accounts[0] });
    console.log(result);
    alert("트랜잭션 해시 :" + result.transactionHash);
    return result;
};

const executeAIRDROP = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
        abi,
        "0xC3F789cB9733de19da5BCFd84E1277c24b75599b"
    );
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
        .airdrop()
        .send({ from: accounts[0] });
    console.log(result);
    alert("트랜잭션 해시 :" + result.transactionHash);
    return result;
};

const walletWatchAsset = async () => {
    try {
        const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
            type: "ERC20",
            options: {
            address: "0x2d3CE908D91dB4Ff3736C8ff00A4B5E5765efDb8",
            symbol: "LUD",
            decimals: 18,
            image: null,
            },
        },
        });
        if (wasAdded) {
        alert("Thanks for your interest!");
        } else {
        alert("Your loss!");
        }
    } catch (error) {
        console.log(error);
    }
};

const getNetworkName = (networkId) => {
    switch (networkId) {
        case 1:
        return "Mainnet";
        case 1001:
        return "Klaytn Testnet";
        default:
        return `Unknown (${networkId})`;
    }
};

connectButton.onclick = async () => {
    await updateWalletInfo();
    walletInfo.style.display = "block";
};

nftButton.onclick = async () => {
    await executeNFTMINT();
    walletInfo.style.display = "block";
};

airdropButton.onclick = async () => {
    await executeAIRDROP();
    walletInfo.style.display = "block";
};
tokenaddButton.onclick = async () => {
    await walletWatchAsset();
    walletInfo.style.display = "block";
};