import { Container, Typography } from "@mui/material";
import LostDomesticLead from "../components/LostDomesticLead";
import ReceivedDomesticOrder from "../components/ReceiveDomesticOrder";
import LostDomesticTable from "../components/LostDomesticTable";
import BudgetaryQuotationForm from "../components/BudgetaryQuotationForm";
import LeadSubmittedForm from "../components/LeadSubmittedForm";
import DomesticLeadForm from "../components/DomesticLeadForm";
import ExportLeadForm from "../components/ExportLeadForm";
import CRMLeadForm from "../components/CRMLeadForm";
import NavigationTab from "../components/NavigationTab";
import RakBudgetaryQuotationForm from "../components/rakshitha/BudgetaryQuotation";

const CrmPage = () => {
	return (
		<div>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				sx={{ fontWeight: 700, color: "#1976d2" }}>
				BEL Marketing Team - Software SBU
			</Typography>
			<>
				{/* <LostDomesticLead/> */}
				{/* <ReceivedDomesticOrder/> */}
				{/* <BudgetaryQuotationForm/> */}
				{/* <RakBudgetaryQuotationForm/> */}
				{/* <LeadSubmittedForm/> */}
				{/* <DomesticLeadForm/> */}
				{/* <ExportLeadForm/> */}
				{/* <CRMLeadForm/> */}
				<NavigationTab />
				{/*===========To present the data============== */}
				{/* <LostDomesticTable/> */}
			</>
		</div>
	);
};

export default CrmPage;
