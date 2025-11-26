import { Typography } from '@mui/material';
import LostDomesticLead from '../components/LostDomesticLead';
import ReceivedDomesticOrder from '../components/ReceiveDomesticOrder';


const CrmPage = () => {
	return (
		<div>
			<Typography>BEL Marketing Team</Typography>
			<LostDomesticLead/>
			{/* <ReceivedDomesticOrder/> */}
		</div>
	)
}

export default CrmPage;