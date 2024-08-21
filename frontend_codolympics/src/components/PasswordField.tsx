import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ChangeEvent, useState } from "react";

type Password = {
    label: string;
    name: string;
    id: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
};

export const PasswordField = (props: Password) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <FormControl
            key={props.id}
            fullWidth
            size="small"
            variant="outlined"
            required
            style={{ marginBottom: 10 }}
        >
            <InputLabel key={`label_${props.id}`}>{props.label}</InputLabel>
            <OutlinedInput
                key={`input_${props.id}`}
                type={showPassword ? "text" : "password"}
                name={props.name}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => props?.onChange && props.onChange(e) }
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
};
