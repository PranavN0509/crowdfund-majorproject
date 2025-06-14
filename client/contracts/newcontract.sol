// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(
        uint256 minimum,
        string memory name,
        string memory description,
        string memory image,
        uint256 target
    ) public {
        address newCampaign = address(
            new Campaign(minimum, msg.sender, name, description, image, target)
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimunContribution;
    string public CampaignName;
    string public CampaignDescription;
    string public imageUrl;
    uint256 public targetToAchieve;
    address[] public contributers;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        uint256 minimun,
        address creator,
        string memory name,
        string memory description,
        string memory image,
        uint256 target
    ) {
        manager = creator;
        minimunContribution = minimun;
        CampaignName = name;
        CampaignDescription = description;
        imageUrl = image;
        targetToAchieve = target;
    }

    function contribute() public payable {
        require(msg.value > minimunContribution);

        contributers.push(msg.sender);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);

        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }

    // function finalizeRequest(uint index) public restricted {
    //     require(requests[index].approvalCount > (approversCount / 2));
    //     require(!requests[index].complete);

    //     requests[index].recipient.transfer(requests[index].value);
    //     requests[index].complete = true;
    // }

    function finalizeRequest(uint256 index) public restricted {
        require(requests[index].approvalCount > (approversCount / 2));
        require(!requests[index].complete);

        (bool success, ) = requests[index].recipient.call{
            value: requests[index].value
        }("");
        require(success, "Transfer failed.");

        requests[index].complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        return (
            minimunContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            CampaignName,
            CampaignDescription,
            imageUrl,
            targetToAchieve
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
