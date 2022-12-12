import React, { useContext, createContext } from "react";
import {
	useAddress,
	useContract,
	useMetamask,
	useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
	const { contract } = useContract(
		"0x42313D8640Dd3cF2c8e2754E368eb887Ed9477DD"
	);
	const { mutateAsync: createCampaign } = useContractWrite(
		contract,
		"createCampaign"
	);

	const address = useAddress();
	const connect = useMetamask();

	const publishCampaign = async (form) => {
		try {
			const data = await createCampaign([
				address,
				form.title,
				form.description,
				form.target,
				new Date(form.deadline).getTime(),
				form.image,
			]);
			console.log("contract call success", data);
		} catch (error) {
			console.log("contract call failure");
		}
	};

	const getCampaigns = async () => {
		const campaigns = await contract.call("getCampaigns");

		const parsedCampaigns = campaigns.map((campaign) => ({
			owner: campaign.owner,
			title: campaign.title,
			description: campaign.description,
			target: ethers.utils.formatEther(campaign.target.toString()),
			deadline: campaign.deadline.toNumber(),
			amountCollected: ethers.utils.formatEther(
				campaign.amountCollected.toString()
			),
			image: campaign.image,
			pId: i,
		}));

		return parsedCampaigns;
	};

	return (
		<StateContext.Provider
			value={{
				address,
				contract,
				connect,
				getCampaigns,
				createCampaign: publishCampaign,
			}}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
