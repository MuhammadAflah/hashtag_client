import { useState } from "react";
import {
    Box,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    InputAdornment,
    IconButton,
    Container,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Divider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUserData } from "state/authSlice";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { toast, Toaster } from "react-hot-toast";
import { postDataAPI } from "utils/fetchData";
import LoadingButton from "@mui/lab/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import config from "../../utils/config.js"
import { Tag, Visibility, VisibilityOff } from "@mui/icons-material";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";

const registerSchema = yup.object().shape({
    username: yup
        .string()
        .matches(
            /^[a-z0-9_.]+$/,
            "Username can only contain lowercase letters, underscores, dots, and numbers"
        )
        .required("Username is required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup
        .string()
        .required("required")
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must be at most 20 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
        ),
    picture: yup.string().required("required"),
});

const initialValues = {
    username: "",
    email: "",
    password: "",
    picture: "",
};

const RegistrationForm = () => {
    const [pageType, setPageType] = useState("login");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const register = async (values, onSubmitProps) => {
        try {
            const formData = new FormData();
            for (let value in values) {
                setLoading(true);
                formData.append(value, values[value]);
            }
            formData.append("picturePath", values?.picture?.name);

            const { data } = await postDataAPI(`/auth/register`, formData);
            const savedUser = data;
            onSubmitProps.resetForm();
            setLoading(false);
            if (savedUser?.status === "Pending") {
                navigate(`/verify-email/${savedUser?.user}`);
            }
            // if (savedUser) setPageType("login");
        } catch (err) {
            setLoading(false);
            if (err.response && err?.response?.data?.error) {
                err?.response?.data?.error?.forEach((err) => {
                    toast.error(err, {
                        position: "bottom-center",
                    });
                });
            }
        }
    };

    const handleGoogleLogin = async (response) => {
        const data = JSON.stringify({ token: response.credential });
        axios
        .post(`https://hashtags.site/auth/google-login`, data, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                dispatch(
                    setLogin({
                        token: response?.data?.token,
                    })
                );
                dispatch(
                    setUserData({
                        user: response?.data?.user,
                    })
                );
                navigate("/home");
            })
            .catch((err) => {
                console.error(err);
                ((error) => {
                    toast.error(error?.response?.data?.msg, {
                        position: "top-center",
                    });
                })(err);
            });
    };

    return (
        <Formik
            onSubmit={register}
            initialValues={initialValues}
            validationSchema={registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <MDBContainer className="my-5 main">

                        <MDBCard>
                            <MDBRow className='g-0 body'>

                                <MDBCol md='6'>
                                    <MDBCardImage src='https://static.vecteezy.com/system/resources/previews/003/689/226/non_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg' alt="login form" className='p-4 img-fluid' style={{ objectFit: "cover", height: "100%" }} />
                                </MDBCol>

                                <MDBCol md='6'>
                                    <MDBCardBody className='d-flex flex-column  d-flex align-items-center'>

                                        <div className='d-flex flex-row '>
                                            <MDBIcon fas icon="fa-doutone fa-hashtag fa-3x me-3" style={{ color: '#ff6219' }} />
                                            {/* <Tag style={{ color: '#ff6219' }} /> */}

                                            <span className="h1 fw-bold mb-0">HashTag</span>
                                        </div>

                                        <Typography variant="h5" className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                                            Create an account
                                        </Typography>
                                        <Box>

                                            <TextField
                                                label="username"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.username}
                                                name="username"
                                                fullWidth
                                                error={
                                                    Boolean(touched?.username) && Boolean(errors?.username)
                                                }
                                                helperText={touched?.username && errors?.username}
                                                sx={{ gridColumn: "span 4", mb: 3 }}
                                            />

                                            <Box
                                                gridColumn="span 4"
                                                border={`1px solid ${palette.neutral.medium}`}
                                                borderRadius="5px"
                                                p="1rem"
                                                marginBottom={"1.5rem"}
                                            >
                                                <Dropzone
                                                    acceptedFiles=".jpg,.jpeg,.png"
                                                    multiple={false}
                                                    onDrop={(acceptedFiles) =>
                                                        setFieldValue("picture", acceptedFiles[0])
                                                    }
                                                >
                                                    {({ getRootProps, getInputProps }) => (

                                                        <Box

                                                            {...getRootProps()}
                                                            border={`2px dashed ${palette?.primary?.main}`}
                                                            p="1rem"
                                                            sx={{ "&:hover": { cursor: "pointer" } }}
                                                        >
                                                            <input {...getInputProps()} />
                                                            {!values?.picture ? (
                                                                <p>Add Picture Here</p>
                                                            ) : (
                                                                <FlexBetween>
                                                                    <Typography>{values?.picture?.name}</Typography>
                                                                    <EditOutlinedIcon />
                                                                </FlexBetween>
                                                            )}

                                                        </Box>

                                                    )}
                                                </Dropzone>
                                            </Box>
                                            <TextField
                                                label="Email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.email}
                                                name="email"
                                                fullWidth
                                                error={Boolean(touched?.email) && Boolean(errors?.email)}
                                                helperText={touched?.email && errors?.email}
                                                sx={{ gridColumn: "span 4", mb: 3 }}
                                            />
                                            <TextField
                                                label="Password"
                                                type={showPassword ? "text" : "password"}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.password}
                                                name="password"
                                                fullWidth
                                                error={Boolean(touched?.password) && Boolean(errors?.password)}
                                                helperText={touched?.password && errors?.password}
                                                sx={{ gridColumn: "span 4" }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />

                                            <Box>
                                                <LoadingButton
                                                    loading={loading}
                                                    fullWidth
                                                    type="submit"
                                                    sx={{
                                                        m: "2rem 0",
                                                        p: "1rem",
                                                        backgroundColor: palette?.primary?.main,
                                                        color: palette?.background?.alt,
                                                        "&:hover": {
                                                            color: palette?.primary?.main,
                                                            backgroundColor: palette?.primary?.light
                                                        },
                                                        color: "#FFFFFF"
                                                    }}
                                                >
                                                    REGISTER
                                                </LoadingButton>
                                                <Box mt={2}>
                                                    <Typography variant="body1" align="center">
                                                        Already have an account?
                                                        <Link to="/">
                                                            Login
                                                        </Link>
                                                    </Typography>
                                                </Box>

                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                                <GoogleLogin
                                                    onSuccess={(response) => {
                                                        handleGoogleLogin(response);
                                                    }}
                                                    shape="pill"
                                                    onError={() => {
                                                        console.log("Login Failed");
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </MDBCardBody>
                                </MDBCol>
                            </MDBRow>
                        </MDBCard>
                    </MDBContainer>
                    <Toaster />
                </form>
            )}
        </Formik>
    )
}

export default RegistrationForm