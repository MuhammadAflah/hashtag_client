import { useTheme } from "@emotion/react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import WidgetWrapper from "components/WidgetWrapper";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setLogin, setUserData } from "state/authSlice";
import { postDataAPI } from "utils/fetchData";

const VerifyEmail = () => {
  const theme = useTheme();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const { id } = useParams();

  const handleOTP = async (e) => {
    try {
      e.preventDefault();
      const { data } = await postDataAPI(`/auth/verify-email/${id}`, { OTP });
      if (data) {
        dispatch(
          setLogin({
            token: data.token,
          })
        );
        dispatch(
          setUserData({
            user: data.user,
          })
        );
        navigate("/home");
      }
    } catch (err) {
      (({ response }) => {
        toast.error(response?.data?.message, {
          position: "bottom-center",
        });
      })(err);
    }
  };

  return (
    <form>
      <MDBContainer className="my-5 main">

        <MDBCard>
          <MDBRow className='g-0 body'>

            <MDBCol item md='6'>
              <MDBCardImage src='https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7867.jpg' alt="login form" className='p-5 img-fluid' style={{ objectFit: "cover", height: "100%" }} />
            </MDBCol>

            <MDBCol item md='6'>
              <MDBCardBody className='d-flex flex-column mt-5 d-flex align-items-centeryy'>

                <div className='d-flex flex-row mt-2'>
                  <MDBIcon fas icon="fa-doutone fa-hashtag fa-3x me-3" style={{ color: '#ff6219' }} />
                  {/* <Tag style={{ color: '#ff6219' }} /> */}

                  <span className="h1 fw-bold mb-0">HashTag</span>
                </div>

                <Typography variant="h5" className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>
                  Enter OTP
                </Typography>
                <Box>

                  <TextField
                    label="OTP"
                    onChange={(e) => setOTP(e.target.value)}
                    name="otp"
                    fullWidth
                    sx={{ gridColumn: "span 4" }}
                  />

                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOTP}
                      type="submit"
                      fullWidth
                      sx={{ mt: 3 }}
                    >
                      Submit
                    </Button>
                    <Box sx={{ mt: 2 }}>
                      <Link to="/">
                        <Typography
                          sx={{
                            textAlign: "left",
                            textDecoration: "underline",
                            color: palette?.primary?.main,
                            "&:hover": {
                              cursor: "pointer",
                              color: palette?.primary?.light,
                            },
                          }}
                        >
                          Back to the page
                        </Typography>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
      <Toaster />
    </form>
  );
};

export default VerifyEmail;
