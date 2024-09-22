import { Box, LinearProgress } from "@mui/material";

type ProgressBarType = {
    value?: number;
};

export const ProgressBar = (props: ProgressBarType) => {
    if (!props?.value || props.value === 0)
        return <></>;
    
    return (
        <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={props.value} />
        </Box>
    );
};
