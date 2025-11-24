import { makeStyles } from "@mui/styles";

const useStyle = makeStyles({
	button: {},
});

const HomePage = () => {
	const classesName = useStyle();
	return <div className={classesName}></div>;
};

export default HomePage;
