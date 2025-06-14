// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract CampaignFactory {

    address[] public deployedCampaigns;

    function createCampaign(
        string memory organization_name,
        string memory title,
        string memory description,
        uint256 minimum_amount,
        uint256 target_amount,
        uint256 end_date,
        string memory image
    ) public {
    
        Campaign newCampaign = new Campaign(
            msg.sender,
            organization_name,
            title,
            description,
            minimum_amount,
            target_amount,
            end_date,
            image
        );
        
        deployedCampaigns.push(address(newCampaign));

    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function getDeployedCampaignsArrayLength() public view returns (uint256) {
        return deployedCampaigns.length;
    }

}

//   contract address: 0x81959c21248BD5Bc973050b55F63e61A186EADA2

contract Campaign {

    event ContributionMade(address indexed contributor, uint256 amount);
    event RequestCreated(uint256 requestId, string description, uint256 value);
    event RequestApproved(uint256 indexed requestId, address indexed approver);
    event RequestCompleted(uint256 requestId, address recipient);
    
    struct Request {
        string description;      // Describes the purpose of the request.
        uint256 value;          // Amount of funds requested.
        string beforeImg;         
        string afterImg;         
        address recipient;       // Address of the recipient to receive funds.
        bool complete;           // Tracks if the request has been fulfilled.
        uint256 approvalCount;   // Number of contributor approvals.
        mapping(address => bool) approvals; // Mapping to track contributors who approved.
    }

    Request[] public requests;
    address public manager;
    string public OrganizationName;
    string public CampaignName;
    string public CampaignDescription;
    uint256 public minimumContribution;
    uint256 public targetToAchieve;
    uint256 public End_Date;
    string public imageUrl;
    bool campaignIsActive = true;
    address[] public contributers;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        address creator,
        string memory organization_name,
        string memory title,
        string memory description,
        uint256 minimum_amount,
        uint256 target,
        uint256 end_date,
        string memory image
    ) {
        manager = creator;
        OrganizationName = organization_name;
        CampaignName = title;
        CampaignDescription = description;
        minimumContribution = minimum_amount;
        targetToAchieve = target;
        End_Date = end_date;
        imageUrl = image;
    }

    function contribute() public payable {
        // Check if the contributor is not the campaign creator
        require(msg.sender != manager, "Campaign creator cannot contribute to their own campaign.");
        
        // Ensure the sender has not contributed before
        require(!approvers[msg.sender], "You have already contributed to this campaign.");

        // Ensure the contribution meets the minimum requirement
        require(msg.value > minimumContribution, "Contribution is less than the minimum amount.");
        
        // Ensure the campaign has not ended
        require(End_Date > block.timestamp, "The campaign has ended.");

        // Ensure the contribution does not exceed the target
        require(address(this).balance + msg.value <= targetToAchieve, "Contribution exceeds the campaign target.");
        
        if (!approvers[msg.sender]) {
            contributers.push(msg.sender);
            approvers[msg.sender] = true;
            approversCount++;
        }

        emit ContributionMade(msg.sender, msg.value);
    }


    function createRequest(
        string memory description, 
        uint256 value,
        string memory beforeImage,
        string memory afterImage
        ) 
    public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.beforeImg = beforeImage;
        newRequest.afterImg = afterImage;
        newRequest.recipient = manager;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        emit RequestCreated(requests.length - 1, description, value);
    }


    function approveRequest(uint256 index) public {
        require(approvers[msg.sender], "Only contributors can approve requests.");
        require(index < requests.length, "Invalid request index.");
        require(!requests[index].approvals[msg.sender], "You have already approved this request.");
        require(!requests[index].complete, "This request has already been finalized.");
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
        emit RequestApproved(index, msg.sender);  // Emit an event to log the approval
    }

    // function finalizeRequest(uint index) public restricted {
    //     require(requests[index].approvalCount > (approversCount / 2));
    //     require(!requests[index].complete);

    //     requests[index].recipient.transfer(requests[index].value);
    //     requests[index].complete = true;
    // }
    
    function isRequestApproved(uint256 index) public view returns (bool) {
        Request storage request = requests[index];
        uint256 requiredApprovals = approversCount / 2; // Example threshold (50%)
        return request.approvalCount > requiredApprovals;
    }


    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete, "Request already completed.");
        // require(request.approvalCount > (approversCount / 2), "Not enough approvals.");
        require(isRequestApproved(index), "Not enough approvals for finalization.");
        request.complete = true;
        (bool success, ) = request.recipient.call{ value: request.value }("");
        require(success, "Transfer failed.");

        emit RequestCompleted(index, request.recipient);
    }


    function getRequestDetails(uint256 index) public view returns (
        string memory description,
        uint256 value,
        address recipient,
        bool complete,
        uint256 approvalCount
    ) {
        Request storage request = requests[index];
        return (
            request.description,
            request.value,
            request.recipient,
            request.complete,
            request.approvalCount
        );
    }

    function getSummary()
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            string memory,
            uint256,
            uint256,
            address[] memory
        )
    {
        return (
            manager,
            OrganizationName,
            CampaignName,
            CampaignDescription,
            address(this).balance,
            minimumContribution,
            targetToAchieve,
            End_Date,
            imageUrl,
            requests.length,
            approversCount,
            contributers
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
//     function getAllRequests() public view returns (Request[] memory) {
//         return requests;
//     }
}
