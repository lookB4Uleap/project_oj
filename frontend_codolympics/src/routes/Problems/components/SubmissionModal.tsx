import { Box, Modal, Typography } from "@mui/material";
import { SubmissionType } from "../types";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

type SubmissionModalType = {
    submission: SubmissionType | null;
    onClose: () => void
}

export const SubmissionModal = (props: SubmissionModalType) => {
    return (
        <Modal
            open={!!props?.submission?.open}
            onClose={props?.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Submission {props?.submission?.verdict}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {`${props.submission?.passed}/${props.submission?.tests} testcases passed`}
                </Typography>
            </Box>
        </Modal>
    );
};
