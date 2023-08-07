import React, { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import CopyToClipboard from "react-copy-to-clipboard";
import Web3 from "web3";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import {
  BUSD_Abi,
  BUSD_Address,
  TetherToken_Eth_Abi,
  TetherToken_Eth_Address,
  USDC_Eth_Abi,
  USDC_Eth_Address,
  USDT_Abi,
  USDT_Address,
  Blend_Protoco_Presale_BNB_Abi,
  Blend_Protoco_Presale_BNB_Address,
  Blend_Protoco_Presale_Eth_Abi,
  Blend_Protoco_Presale_Eth_Address,
} from "../util/Contract";
import { toast } from "react-hot-toast";

const Presale = () => {
  let history = window.location;
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [isActive, setisActive] = useState(0);
  const [Token_Balance, setToken_Balance] = useState(0);
  const [get_userValue, setget_userValue] = useState("");
  const [show_value, setshow_value] = useState(0);
  const [getmaxTokeninPresale, setgetmaxTokeninPresale] = useState(0);
  const [Blend_Protoco_Sold, setBlend_Protoco_Sold] = useState(0);
  const [contractbalance, setcontractbalance] = useState(0);
  const [refAddress, setRefAddress] = useState("");
  const [spinner, setspinner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, seterror] = useState("");

  // console.log("chains",chain?.id);
  const data1 = useBalance({
    address: address || null,
  });
  const webSupply = new Web3("https://eth-sepolia.public.blastapi.io");
  const webSupply_Binance = new Web3("https://bsc-testnet.public.blastapi.io");

  const USDT_Balance = async () => {
    let contractOf_Token;
    let contractOf_BUSDToken;
    let contractOf;
    let contractOf_USDT;
    let contractOf_USDC;

    if (chain?.id == 97) {
      contractOf_BUSDToken = new webSupply_Binance.eth.Contract(
        BUSD_Abi,
        BUSD_Address
      );
      contractOf = new webSupply_Binance.eth.Contract(
        Blend_Protoco_Presale_BNB_Abi,
        Blend_Protoco_Presale_BNB_Address
      );
      contractOf_USDT = new webSupply_Binance.eth.Contract(
        USDT_Abi,
        USDT_Address
      );
    } else {
      contractOf_Token = new webSupply.eth.Contract(
        TetherToken_Eth_Abi,
        TetherToken_Eth_Address
      );
      contractOf = new webSupply.eth.Contract(
        Blend_Protoco_Presale_Eth_Abi,
        Blend_Protoco_Presale_Eth_Address
      );
      contractOf_USDC = new webSupply.eth.Contract(
        USDC_Eth_Abi,
        USDC_Eth_Address
      );
    }
    let contractOf_Eth = new webSupply.eth.Contract(
      Blend_Protoco_Presale_Eth_Abi,
      Blend_Protoco_Presale_Eth_Address
    );
    let contractOf_BNB = new webSupply_Binance.eth.Contract(
      Blend_Protoco_Presale_BNB_Abi,
      Blend_Protoco_Presale_BNB_Address
    );

    if (address && isActive == 1) {
      if (chain?.id == 97) {
        let balance = await contractOf_BUSDToken.methods
          .balanceOf(address)
          .call();
        balance = webSupply_Binance.utils.fromWei(balance.toString());
        setToken_Balance(balance);
      } else {
        let balance = await contractOf_Token.methods.balanceOf(address).call();
        setToken_Balance(balance / 1000000);
      }
    } else if (address && isActive == 2) {
      let balance = await contractOf_USDT.methods.balanceOf(address).call();
      balance = webSupply_Binance.utils.fromWei(balance.toString());
      setToken_Balance(balance);
    }

    let Blend_Protoco_Sold = await contractOf.methods.token_Sold().call();
    Blend_Protoco_Sold = webSupply.utils.fromWei(Blend_Protoco_Sold);
    setBlend_Protoco_Sold(Blend_Protoco_Sold);

    let maxTokeninPresale = await contractOf.methods.maxTokeninPresale().call();
    maxTokeninPresale = webSupply.utils.fromWei(maxTokeninPresale.toString());
    setgetmaxTokeninPresale(maxTokeninPresale);

    let USDraised_BNB = await contractOf_BNB.methods.USDraised().call();
    USDraised_BNB = webSupply_Binance.utils.fromWei(USDraised_BNB.toString());

    let USDraised_ETH = await contractOf_Eth.methods.USDraised().call();
    USDraised_ETH = Number(USDraised_ETH) / Number(1000000);
    setcontractbalance(
      // Number(USDraised_BNB)
      // Number(USDraised_ETH)
      Number(USDraised_BNB) + Number(USDraised_ETH)
    );
  };

  const getLive_Rate = async () => {
    try {
      if (get_userValue) {
        let contractOf;
        if (chain?.id == 97) {
          contractOf = new webSupply_Binance.eth.Contract(
            Blend_Protoco_Presale_BNB_Abi,
            Blend_Protoco_Presale_BNB_Address
          );
        } else {
          contractOf = new webSupply.eth.Contract(
            Blend_Protoco_Presale_Eth_Abi,
            Blend_Protoco_Presale_Eth_Address
          );
        }
        if (isActive == 0) {
          // console.log("data1?.data?.formatted",parseFloat(data1?.data?.formatted).toFixed(4));
          if (Number(get_userValue) < parseFloat(data1?.data?.formatted).toFixed(4)) {
            seterror("")
            let value = webSupply.utils.toWei(get_userValue.toString());
            if (chain?.id == 97) {
              let getBlend_ProtocovalueperBNB = await contractOf.methods
                .getvalueperBNB(value)
                .call();
              let result = webSupply_Binance.utils.fromWei(
                getBlend_ProtocovalueperBNB.toString()
              );
              setshow_value(result);
            } else {
              let getBlend_ProtocovalueperETH = await contractOf.methods
                .getvalueperETH(value)
                .call();
              let result = webSupply.utils.fromWei(
                getBlend_ProtocovalueperETH.toString()
              );
              setshow_value(result);
            }
          } else {
            seterror(
              `You do not have enough ${
                chain?.id == 97 ? "BNB" : "ETH"
              } to pay for this transaction`
            );
          }
        } else if (isActive == 1) {
          if (get_userValue < Token_Balance) {
            seterror("")
            if (chain?.id == 97) {
              let value = webSupply_Binance.utils.toWei(
                get_userValue.toString()
              );
              let getBlend_ProtocovalueperBUSD = await contractOf.methods
                .getvalueperBUSD(value)
                .call();
              let result = webSupply_Binance.utils.fromWei(
                getBlend_ProtocovalueperBUSD.toString()
              );
              setshow_value(result);
            } else {
              let value = get_userValue * 1000000;
              // console.log("value",value);
              let getBlend_ProtocovalueperUSDT = await contractOf.methods
                .getvalueperUSDT(value)
                .call();
              let result = webSupply.utils.fromWei(
                getBlend_ProtocovalueperUSDT.toString()
              );
              setshow_value(result);
            }
          } else {
            seterror(
              `You do not have enough ${
                chain?.id == 97 ? "BUSD" : "USDC"
              } to pay for this transaction`
            );
          }
        } else if (isActive == 2) {
          if (get_userValue < Token_Balance) {
            seterror("")
            if (chain?.id == 97) {
              let value = webSupply_Binance.utils.toWei(
                get_userValue.toString()
              );
              let getBlend_ProtocovalueperBUSD = await contractOf.methods
                .getvalueperBUSD(value)
                .call();
              let result = webSupply_Binance.utils.fromWei(
                getBlend_ProtocovalueperBUSD.toString()
              );
              setshow_value(result);
            } else {
              let value = get_userValue * 1000000;
              let getBlend_ProtocovalueperUSDT = await contractOf.methods
                .getvalueperUSDT(value)
                .call();
              let result = webSupply.utils.fromWei(
                getBlend_ProtocovalueperUSDT.toString()
              );
              setshow_value(result);
            }
          } else {
            seterror(
              `You do not have enough ${
                chain?.id == 97 ? "USDT" : "USDT"
              } to pay for this transaction`
            );
          }
        }
      }else {
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLive_Rate();
    USDT_Balance();
   
  }, [get_userValue, isActive]);

  const buyEth = async () => {
    try {
      if (address) {
        if (get_userValue != "") {
          if (get_userValue > parseFloat(data1?.data?.formatted).toFixed(4)) {
            toast.error("Insufficient balance");
            setspinner(false);
          } else {
            setspinner(true);
            let UserID = "0x0000000000000000000000000000000000000000";
            if (window.location.href.includes("ref")) {
              UserID = window.location.href.split("=");
              UserID = UserID[UserID.length - 1];
            }

            const { request } = await prepareWriteContract({
              address:Blend_Protoco_Presale_Eth_Address ,
              abi: Blend_Protoco_Presale_Eth_Abi,
              functionName: "BuyWithETH",
              args: [UserID],
              value: webSupply_Binance.utils.toWei(get_userValue.toString()),
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });

            toast.success("Transaction Completed");

            setspinner(false);
          }
        } else {
          toast.error("Please Enter Amount First");
          setspinner(false);
        }
      } else {
        toast.error("Connect Wallet!");
        setspinner(false);
      }
    } catch (error) {
      console.log(error);
      setspinner(false);
    }
  };

  const buyBNB = async () => {
    try {
      if (address) {
        if (get_userValue != "") {
          if (get_userValue > parseFloat(data1?.data?.formatted).toFixed(4)) {
            toast.error("Insufficient balance");
            setspinner(false);
          } else {
            setspinner(true);

            let UserID = "0x0000000000000000000000000000000000000000";
            if (window.location.href.includes("ref")) {
              UserID = window.location.href.split("=");
              UserID = UserID[UserID.length - 1];
            }
            console.log("get_userValue",get_userValue);
            const { request } = await prepareWriteContract({
              address: Blend_Protoco_Presale_BNB_Address,
              abi: Blend_Protoco_Presale_BNB_Abi,
              functionName: "BuyWithBNB",
              args: [UserID],
              value: webSupply.utils.toWei(get_userValue.toString()),
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });
            setTimeout(() => {
              setspinner(false);
              toast.success("Transaction Completed");
            }, 4000);
          }
        } else {
          toast.error("Please Enter Amount First");
          setspinner(false);
        }
      } else {
        toast.error("Connect Wallet!");
        setspinner(false);
      }
    } catch (error) {
      console.log(error);
      setspinner(false);
    }
  };

  const buyUSDT = async () => {
    try {
      if (address) {
        if (get_userValue != "") {
          let UserID = "0x0000000000000000000000000000000000000000";
          if (window.location.href.includes("ref")) {
            UserID = window.location.href.split("=");
            UserID = UserID[UserID.length - 1];
          }
          if (chain.id == 11155111 && isActive == 1) {
            setspinner(true);

            let value = get_userValue * 1000000;
            console.log("value", value);

            const { request } = await prepareWriteContract({
              address: USDC_Eth_Address,
              abi: USDC_Eth_Abi,
              functionName: "approve",
              args: [Blend_Protoco_Presale_Eth_Address, value],
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });
            setTimeout(() => {
              setspinner(false);
              toast.success("Approve SuccessFully");
              Ethereum_Token(UserID);
            }, 5000);
          } else if (chain.id == 11155111 && isActive == 2) {
            setspinner(true);

            let value = get_userValue * 1000000;

            const { request } = await prepareWriteContract({
              address: TetherToken_Eth_Address,
              abi: TetherToken_Eth_Abi,
              functionName: "approve",
              args: [Blend_Protoco_Presale_Eth_Address, value],
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });

            setTimeout(() => {
              setspinner(false);
              toast.success("Approve SuccessFully");
              Ethereum_Token(UserID);
            }, 5000);
          }
        } else {
          toast.error("Please Enter Amount First");
          setspinner(false);
        }
      } else {
        toast.error("Connect Wallet!");
      }
    } catch (error) {
      setspinner(false);

      console.log(error);
    }
  };

  const Ethereum_Token = async (UserID) => {
    try {
      let value = get_userValue * 1000000;

      if (chain.id == 11155111 && isActive == 1) {
        setspinner(true);

        const { request } = await prepareWriteContract({
          address: Blend_Protoco_Presale_Eth_Address,
          abi: Blend_Protoco_Presale_Eth_Abi,
          functionName: "BuyWithUSDC",
          args: [value, UserID],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });

        setTimeout(() => {
          setspinner(false);
          toast.success("Transaction Completed");
        }, 4000);
      } else if (chain.id == 11155111 && isActive == 2) {
        setspinner(true);
        const { request } = await prepareWriteContract({
          address: Blend_Protoco_Presale_Eth_Address,
          abi: Blend_Protoco_Presale_Eth_Abi,
          functionName: "BuyWithUSDT",
          args: [value, UserID],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });

        setTimeout(() => {
          setspinner(false);
          toast.success("Transaction Completed");
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyBUSD = async () => {
    try {
      if (address) {
        if (get_userValue != "") {
          let UserID = "0x0000000000000000000000000000000000000000";
          if (window.location.href.includes("ref")) {
            UserID = window.location.href.split("=");
            UserID = UserID[UserID.length - 1];
          }
          if (chain.id == 97 && isActive == 1) {
            setspinner(true);

            let value = webSupply_Binance.utils.toWei(get_userValue.toString());

            const { request } = await prepareWriteContract({
              address: BUSD_Address,
              abi: BUSD_Abi,
              functionName: "approve",
              args: [Blend_Protoco_Presale_BNB_Address, value],
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });

            setTimeout(() => {
              setspinner(false);
              toast.success("Approve SuccessFully");
              BUSD_Buy(UserID);
            }, 5000);
          } else if (chain.id == 97 && isActive == 2) {
            setspinner(true);

            let value = webSupply_Binance.utils.toWei(get_userValue.toString());
            const { request } = await prepareWriteContract({
              address: USDT_Address,
              abi: USDT_Abi,
              functionName: "approve",
              args: [Blend_Protoco_Presale_BNB_Address, value],
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });

            setTimeout(() => {
              setspinner(false);
             toast.success("Approve SuccessFully");
              BUSD_Buy(UserID);
            }, 5000);
          }
        } else {
          toast.error("Please Enter Amount First");
          setspinner(false);
        }
      } else {
        toast.error("Connect Wallet!");
        setspinner(false);
      }
    } catch (error) {
      setspinner(false);

      console.log(error);
    }
  };

  const BUSD_Buy = async (UserID) => {
    try {
      let value = webSupply_Binance.utils.toWei(get_userValue.toString());
      if (chain.id == 97 && isActive == 1) {
        setspinner(true);

        const { request } = await prepareWriteContract({
          address: Blend_Protoco_Presale_BNB_Address,
          abi: Blend_Protoco_Presale_BNB_Abi,
          functionName: "BuyWithBUSD",
          args: [value, UserID],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });

        setTimeout(() => {
          setspinner(false);
          toast.success("Transaction Completed");
        }, 4000);
      } else if (chain.id == 97 && isActive == 2) {
        setspinner(true);

        const { request } = await prepareWriteContract({
          address: Blend_Protoco_Presale_BNB_Address,
          abi: Blend_Protoco_Presale_BNB_Abi,
          functionName: "BuyWithUSDT",
          args: [value, UserID],
          account: address,
        });
        const { hash } = await writeContract(request);
        const data = await waitForTransaction({
          hash,
        });

        setTimeout(() => {
          setspinner(false);
          toast.success("Transaction Completed");
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Completionist = () => {
    return (
      <>
        <div className="text_days fs-5 ">Date of Sale TBA</div>
      </>
    );
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <div className="row justify-content-between mt-3 ml-10">
          <div className="col-3">
            <div className="white_box">
              <p>{days}d</p>
            </div>
          </div>
          <div className="col-3  mt-md-0">
            <div className="white_box">
              <p>{hours}h</p>
            </div>
          </div>
          <div className="col-3  mt-md-0">
            <div className="white_box">
              <p>{minutes}m</p>
            </div>
          </div>
          <div className="col-3  mt-md-0">
            <div className="white_box">
              <p>{seconds}s</p>
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (address) {
      setRefAddress(`${history.href}?ref=${address}`);
    } else {
      setRefAddress("Connect wallet");
    }

    setInterval(() => {
      setCopied(false);
    }, 3000);
  }, [address, copied]);
  return (
    <>
      <div className="container mx-auto px-6 pb-24 pt-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div>
              <h2 className="text-accent">
                Blend <span className="font-light">Protocol</span>{" "}
              </h2>
              <div className="max-w-[600px] w-full mt-4 text-lg">
                Take control of your DeFi transactions like never before, with
                Blend Protocol, a cutting-edge privacy application, built on the
                Ethereum blockchain.
              </div>
            </div>
            <div className="mt-16">
              <h2 className="text-accent">
                Referral <span className="font-light">Program</span>{" "}
              </h2>
              <div className="max-w-[600px] w-full mt-4 text-lg">
                Share your referral link and get paid 5% of the ETH contributed,
                instantly to your wallet, for every referred purchase.
              </div>
            </div>

            <div className="mt-6 relative max-w-[500px]">
              <input
                value={refAddress}
                className="border border-accent h-12 bg-accent/10  w-full py-2 px-4"
              />
              <CopyToClipboard text={refAddress} onCopy={() => setCopied(true)}>
                <button className="py-2 px-6 bg-accent absolute right-1 rounded-lg top-1/2 -translate-y-1/2">
                  {copied ? "COPIED" : "COPY"}{" "}
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <div className="m-auto order-first lg:order-last">
            {/* <Presale/> */}
            <div className="border border-accent rounded-2xl bg-[#091620]  p-4 md:p-8 presale-shadow w-full">
              <div className="flex flex-col">
                <button
                  className="py-2 px-6 font-medium tracking-normal bg-accent hover:bg-accent/80 rounded-full"
                  onClick={() =>
                    address
                      ? chain?.id == chains[0]?.id
                        ? open()
                        : switchNetwork?.(chains[0]?.id)
                      : open()
                  }
                >
                  {address ? (
                    chain?.id == chains[0]?.id || chain?.id == chains[1]?.id ? (
                      address ? (
                        <>
                          {`${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`}{" "}
                        </>
                      ) : (
                        "connect wallet"
                      )
                    ) : (
                      "Switch NewWork"
                    )
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
                {/* BUY BLEND IN PRESALE START */}
                <div className="my-6 text-center  space-y-4">
                  <span className="uppercase text-accent font-medium">
                    Buy Blend in presale
                  </span>
                  {/* PROGRESS BAR START */}
                  <div className="relative ">
                    <div className="h-6 border border-accent rounded-full" />
                    <div
                      className="h-6 bg-accent rounded-full  absolute top-0 left-0"
                      style={{
                        width:
                          Number(Blend_Protoco_Sold) /
                          Number(getmaxTokeninPresale) /
                          100,
                      }}
                    />
                    <div className="uppercase font-medium text-[10px] z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                      Until sold out
                    </div>
                  </div>
                  {/* PROGRESS BAR END */}
                  <div className="">
                    USDT Raised :
                    <span className="font-bold tracking-wide mx-1">
                      {parseFloat(contractbalance).toFixed(2)} / 3,00,000
                    </span>
                  </div>
                </div>
                {/* BUY BLEND IN PRESALE END */}

                {/* Token Selection START */}
                <div className="flex gap-8 items-center">
                  <div className="w-full h-[1px] bg-white/20" />
                  <div className="shrink-0 font-bold">1 BLEND = $0.002</div>
                  <div className="w-full h-[1px] bg-white/20" />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div
                    className={`p-2 border border-accent cursor-pointer hover:bg-accent flex gap-2 justify-center items-center rounded-xl ${
                      isActive == 0 ? "bg-accent" : ""
                    } `}
                    onClick={() => setisActive(0)}
                  >
                    {chain?.id == 97 ? (
                      <>
                        <img className="w-6" src="/icons/bnb.png" alt="" />
                      </>
                    ) : (
                      <>
                        <img className="w-6" src="/icons/eth.png" alt="" />
                      </>
                    )}
                    <sapan className="font-medium">
                      {" "}
                      {chain?.id == 97 ? <>BNB</> : <>ETH</>}
                    </sapan>
                  </div>
                  <div
                    className={`p-2 border border-accent cursor-pointer hover:bg-accent flex gap-2 justify-center items-center rounded-xl ${
                      isActive == 1 ? "bg-accent" : ""
                    } `}
                    onClick={() => setisActive(1)}
                  >
                    {chain?.id == 97 ? (
                      <>
                        <img
                          className="w-6 rounded-full"
                          src="/icons/Busd.png"
                          alt=""
                        />
                      </>
                    ) : (
                      <>
                        <img
                          className="w-6 rounded-full"
                          src="/icons/usdc.png"
                          alt=""
                        />
                      </>
                    )}
                    <span className="font-medium">
                      {chain?.id == 97 ? <>BUSD</> : <>USDC</>}
                    </span>
                  </div>
                  <div
                    className={`p-2 border border-accent cursor-pointer hover:bg-accent flex gap-2 justify-center items-center rounded-xl ${
                      isActive == 2 ? "bg-accent" : ""
                    } `}
                    onClick={() => setisActive(2)}
                  >
                    {chain?.id == 97 ? (
                      <>
                        <img className="w-6" src="/icons/usdt.svg" alt="" />
                      </>
                    ) : (
                      <>
                        <img className="w-6" src="/icons/usdt.svg" alt="" />
                      </>
                    )}
                    <span className="font-medium">
                      {chain?.id == 97 ? <>USDT</> : <>USDT</>}
                    </span>
                  </div>
                </div>
                {/* Token Selection END */}
                <p className="eth_bla text-center mt-5">
                  {" "}
                  {isActive == 0
                    ? chain?.id == 97
                      ? "BNB "
                      : "ETH "
                    : isActive == 1
                    ? chain?.id == 97
                      ? "BUSD "
                      : "USDC "
                    : "USDT "}
                  balance :{" "}
                  <span className="fs-5">
                    {isActive == 0 ? (
                      <>
                        {data1?.data?.formatted == undefined
                          ? 0
                          : parseFloat(data1?.data?.formatted).toFixed(4)}{" "}
                      </>
                    ) : (
                      <>{parseFloat(Token_Balance).toFixed(4)} </>
                    )}
                  </span>
                </p>
                {/* Token AMOUNT INPUT START */}
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <label className="mb-2 inline-block text-sm">
                      Amount in {isActive==0 ? chain?.id == 97 ? "BNB":"ETH":isActive==1 ? chain?.id == 97 ? "BUSD":"USDT":"USDT" } 
                    </label>
                    <div className="relative">
                      <input
                        className="h-12 px-4 py-2 w-full rounded-lg border border-accent bg-accent/10"
                        placeholder="0.0"
                        value={get_userValue}
                        onChange={(e) => setget_userValue(e.target.value)}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-4">
                        {isActive == 0 ? (
                          <>
                            {chain?.id == 97 ? (
                              <>
                                <img
                                  className="w-6"
                                  src="/icons/bnb.png"
                                  alt=""
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  className="w-6"
                                  src="/icons/eth.png"
                                  alt=""
                                />
                              </>
                            )}
                          </>
                        ) : isActive == 1 ? (
                          <>
                            {chain?.id == 97 ? (
                              <>
                                <img
                                  className="w-6"
                                  src="/icons/Busd.png"
                                  alt=""
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  className="w-6"
                                  src="/icons/usdc.png"
                                  alt=""
                                />
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {chain?.id == 97 ? (
                              <>
                                <img
                                  className="w-6"
                                  src="/icons/usdt.svg"
                                  alt=""
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  className="w-6"
                                  src="/icons/usdt.svg"
                                  alt=""
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 inline-block text-sm">Blend</label>
                    <div className="relative">
                      <input
                        className="h-12 px-4 py-2 w-full rounded-lg border border-accent bg-accent/10"
                        placeholder="0.0"
                        value={show_value}
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 right-4">
                        <img src="/icons/Blend-logo.png" className="w-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token AMOUNT INPUT END */}

                {/* ERROR START */}
                {error !="" ? (
                  <>
                    <div className="mt-6">
                      <div className="text-center text-sm">🚨 ${error}.</div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {/* ERROR END */}

                {/* BUY BUTTON START */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <button
                  disabled={error ? true :false}
                  style={{cursor: (error ? "no-drop":"pointer")}}
                    className="py-2 px-6 font-medium tracking-normal bg-accent hover:bg-accent/80 rounded-full"
                    onClick={() =>
                      isActive == 0
                        ? chain?.id == 97
                          ? buyBNB()
                          : buyEth()
                        : isActive == 1
                        ? chain?.id == 97
                          ? buyBUSD()
                          : buyUSDT()
                        : isActive == 2
                        ? chain?.id == 97
                          ? buyBUSD()
                          : buyUSDT()
                        : ""
                    }
                  >
                    {spinner ? "Loading..." : "Buy Now"}
                  </button>
                  <button
                    className="py-2 px-6 font-medium tracking-normal bg-accent hover:bg-accent/80 rounded-full"
                    onClick={() =>
                      chain?.id == 97
                        ? switchNetwork?.(chains[0]?.id)
                        : switchNetwork?.(chains[1]?.id)
                    }
                  >
                    {chain?.id != 97 ? "Buy with BNB" : "Buy with ETH"}{" "}
                  </button>
                </div>
                {/* BUY BUTTON END */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Presale;
