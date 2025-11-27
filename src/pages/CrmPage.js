import { Container, Typography } from '@mui/material';
import LostDomesticLead from '../components/LostDomesticLead';
import ReceivedDomesticOrder from '../components/ReceiveDomesticOrder';
import LostDomesticTable from '../components/LostDomesticTable';
import BudgetaryQuotationForm from '../components/BudgetaryQuotationForm';
import LeadSubmittedForm from '../components/LeadSubmittedForm';
import DomesticLeadForm from '../components/DomesticLeadForm';
import ExportLeadForm from '../components/ExportLeadForm';
import CRMLeadForm from '../components/CRMLeadForm';


const CrmPage = () => {
	return (
		<div>
			<Typography>BEL Marketing Team</Typography>
			<Container>
			{/* <LostDomesticLead/> */}
			{/* <ReceivedDomesticOrder/> */}
			{/* <BudgetaryQuotationForm/> */}
			{/* <LeadSubmittedForm/> */}
			{/* <DomesticLeadForm/> */}
			{/* <ExportLeadForm/> */}
			<CRMLeadForm/>
			{/*===========To present the data============== */}
			{/* <LostDomesticTable/> */}
			</Container>
		</div>
	)
}

export default CrmPage;